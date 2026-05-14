const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { signToken } = require('../config/jwt');
const { sequelize } = require('../config/db');
const { User, Movie, Theatre, Show, Seat, Booking, FoodItem, FoodOrder, FoodOrderItem } = require('../models');
const { sendBookingConfirmationEmail } = require('../utils/mailer');
const { buildBookingEmail } = require('../utils/bookingEmailTemplate');

// ─── TMDb helpers (server-side) ───────────────────────────────
const https = require('https');

const TMDB_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

const GENRE_MAP = {
  28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
  99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
  27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',
  10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'
};

function tmdbGet(path) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.themoviedb.org/3${path}&api_key=${TMDB_KEY}`, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function syncTmdbMovies() {
  try {
    const [nowData, upData] = await Promise.all([
      tmdbGet('/movie/now_playing?language=en-US&page=1'),
      tmdbGet('/movie/upcoming?language=en-US&page=1'),
    ]);

    const toUpsert = [
      ...(nowData.results || []).slice(0, 10).map(m => ({ ...m, _status: 'now' })),
      ...(upData.results  || []).slice(0, 6).map(m => ({ ...m, _status: 'upcoming' })),
    ];

    // Load all theatres once
    const theatres = await Theatre.findAll();
    if (!theatres.length) return; // no theatres seeded yet

    // Show times to create
    const SHOW_TIMES = ['10:00 AM', '1:30 PM', '4:45 PM', '7:30 PM', '10:15 PM'];

    // Next 5 dates
    const today = new Date();
    const dates = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    for (const m of toUpsert) {
      const genre = (m.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean)[0] || 'Movie';
      const poster = m.poster_path   ? `${TMDB_IMG}/w400${m.poster_path}`   : null;
      const trailer = m.backdrop_path ? `${TMDB_IMG}/w1280${m.backdrop_path}` : poster;
      const year = (m.release_date || '').slice(0, 4) || '2025';

      // Upsert the movie row
      const [movieRow] = await Movie.upsert({
        tmdbId:      String(m.id),
        title:       m.title || m.original_title,
        genre,
        rating:      m.vote_average ? Number(m.vote_average.toFixed(1)) : 0,
        duration:    m._runtime || 120,
        description: m.overview || '',
        poster:      poster || 'https://via.placeholder.com/400x600',
        language:    'English',
        releaseDate: m.release_date || `${year}-01-01`,
        cast:        '',
        director:    '',
        trailer:     trailer || '',
        status:      m._status,
      }, { fields: ['title','genre','rating','duration','description','poster','language','releaseDate','trailer','status'], returning: true });

      // Check if shows already exist for this movie
      const existingShowCount = await Show.count({ where: { movieId: movieRow.id } });
      if (existingShowCount > 0) continue; // already has shows, skip

      console.log(`🎬 Creating shows for TMDb movie: ${movieRow.title}`);

      // Create shows across all theatres for next 5 days
      const showsToCreate = [];
      theatres.forEach((theatre, tIdx) => {
        // Each theatre gets a subset of time slots
        const times = SHOW_TIMES.slice(0, 3 + (tIdx % 3));
        dates.forEach(date => {
          times.forEach(time => {
            showsToCreate.push({
              movieId:      movieRow.id,
              theatreId:    theatre.id,
              date,
              time,
              price:        250,
              premiumPrice: 450,
            });
          });
        });
      });

      const createdShows = await Show.bulkCreate(showsToCreate);

      // Create seats for each new show
      const rows = ['A','B','C','D','E','F','G','H','I','J'];
      const seatsPerRow = 10;
      const seatRows = [];
      for (const show of createdShows) {
        for (const row of rows) {
          for (let n = 1; n <= seatsPerRow; n++) {
            seatRows.push({
              showId:     show.id,
              seatNumber: `${row}${n}`,
              type:       ['A','B'].includes(row) ? 'premium' : 'standard',
              isBooked:   false,
            });
          }
        }
      }
      // Bulk insert in chunks
      const CHUNK = 500;
      for (let i = 0; i < seatRows.length; i += CHUNK) {
        await Seat.bulkCreate(seatRows.slice(i, i + CHUNK));
      }
      console.log(`✅ ${createdShows.length} shows & ${seatRows.length} seats created for "${movieRow.title}"`);
    }
  } catch (err) {
    console.warn('⚠️  TMDb sync skipped:', err.message);
  }
}

const resolvers = {
  Query: {
    getMovies: async (_, { genre }) => {
      // Sync fresh TMDb data first (non-blocking on error)
      await syncTmdbMovies();
      const where = genre && genre !== 'All' ? { genre } : {};
      return await Movie.findAll({ where, order: [['releaseDate', 'DESC']] });
    },
    getMovieById: async (_, { id }) => {
      return await Movie.findByPk(id, {
        include: [{ model: Show, as: 'shows', include: [{ model: Theatre, as: 'theatre' }] }],
      });
    },
    getShows: async (_, { movieId }) => {
      return await Show.findAll({
        where: { movieId },
        include: [{ model: Theatre, as: 'theatre' }],
        order: [['date', 'ASC'], ['time', 'ASC']],
      });
    },
    getSeats: async (_, { showId }) => {
      return await Seat.findAll({ where: { showId } });
    },
    getMyBookings: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Booking.findAll({
        where: { userId: user.id },
        include: [
          {
            model: Show,
            as: 'show',
            include: [
              { model: Movie, as: 'movie' },
              { model: Theatre, as: 'theatre' }
            ]
          },
          {
            model: FoodOrder,
            as: 'foodOrder',
            include: [
              {
                model: FoodOrderItem,
                as: 'items',
                include: [{ model: FoodItem, as: 'foodItem' }]
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    },
    getFoodItems: async (_, { theatreId }) => {
      return await FoodItem.findAll({
        where: { theatreId, isActive: true },
        order: [['name', 'ASC']],
      });
    },
  },
  Mutation: {
    signup: async (_, { name, email, password }) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) throw new Error('Email already registered');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      const token = signToken({ id: user.id });
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('User not found');
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid credentials');
      const token = signToken({ id: user.id });
      return { token, user };
    },
    bookTicket: async (_, { showId, seats, promoCode, food }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const createdBookingId = await sequelize.transaction(async (t) => {
        const show = await Show.findByPk(showId, {
          include: [{ model: Movie, as: 'movie' }, { model: Theatre, as: 'theatre' }],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!show) throw new Error('Show not found');

        const safeSeats = Array.isArray(seats) ? seats : [];
        if (safeSeats.length === 0) throw new Error('Please select at least 1 seat');

        // Lock seats for update so we don't double-book
        const seatRecords = await Seat.findAll({
          where: { showId, seatNumber: safeSeats },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        let ticketAmount = 0;
        for (const seat of seatRecords) {
          if (seat.isBooked && seat.lockedBy !== user.id.toString()) {
            throw new Error(`Seat ${seat.seatNumber} is unavailable`);
          }
          ticketAmount += seat.type === 'premium' ? Number(show.premiumPrice) : Number(show.price);
        }

        if (seatRecords.length === 0) {
          ticketAmount = Number(show.price) * safeSeats.length; // fallback
        }

        let discount = 0;
        if (promoCode === 'CINE10') {
          discount = ticketAmount * 0.1;
        }

        // Food ordering (optional) — availability per theatre
        const selections = Array.isArray(food) ? food : [];
        const normalizedSelections = selections
          .filter((x) => x && x.foodItemId != null)
          .map((x) => ({
            foodItemId: Number(x.foodItemId),
            quantity: Number(x.quantity || 0),
          }))
          .filter((x) => Number.isFinite(x.foodItemId) && Number.isFinite(x.quantity) && x.quantity > 0);

        if (normalizedSelections.some((x) => x.quantity > 20)) {
          throw new Error('Food quantity too large');
        }

        let foodTotal = 0;
        let createdFoodOrder = null;

        let foodItemsById = new Map();
        if (normalizedSelections.length > 0) {
          const ids = [...new Set(normalizedSelections.map((x) => x.foodItemId))];
          const foodItems = await FoodItem.findAll({
            where: { id: ids, theatreId: show.theatreId, isActive: true },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });
          foodItemsById = new Map(foodItems.map((fi) => [fi.id, fi]));

          for (const sel of normalizedSelections) {
            const item = foodItemsById.get(sel.foodItemId);
            if (!item) throw new Error('Selected food item is not available for this theatre');
            if (item.availableQuantity < sel.quantity) {
              throw new Error(`${item.name} is out of stock (available: ${item.availableQuantity})`);
            }
          }

          // Decrement stock
          for (const sel of normalizedSelections) {
            const item = foodItemsById.get(sel.foodItemId);
            item.availableQuantity = item.availableQuantity - sel.quantity;
            await item.save({ transaction: t });
            foodTotal += Number(item.price) * sel.quantity;
          }
        }

        const bookingRef = Math.random().toString(36).substring(2, 10).toUpperCase();
        const totalAmount = Number(ticketAmount) - Number(discount) + Number(foodTotal);

        const booking = await Booking.create({
          userId: user.id,
          showId,
          seats: safeSeats,
          totalAmount,
          discount,
          promoCode,
          bookingRef,
          status: 'confirmed',
        }, { transaction: t });

        // Update seats isBooked
        await Seat.update(
          { isBooked: true, lockedBy: null, lockExpiry: null },
          { where: { showId, seatNumber: safeSeats }, transaction: t }
        );

        if (normalizedSelections.length > 0) {
          createdFoodOrder = await FoodOrder.create({
            bookingId: booking.id,
            userId: user.id,
            theatreId: show.theatreId,
            totalAmount: foodTotal,
            status: 'confirmed',
          }, { transaction: t });

          const orderItemsPayload = normalizedSelections.map((sel) => {
            const item = foodItemsById.get(sel.foodItemId);
            const unitPrice = Number(item.price);
            const lineTotal = unitPrice * sel.quantity;
            return {
              foodOrderId: createdFoodOrder.id,
              foodItemId: item.id,
              quantity: sel.quantity,
              unitPrice,
              lineTotal,
            };
          });
          await FoodOrderItem.bulkCreate(orderItemsPayload, { transaction: t });
        }

        return booking.id;
      });

      const fullBooking = await Booking.findByPk(createdBookingId, {
        include: [
          {
            model: Show,
            as: 'show',
            include: [
              { model: Movie, as: 'movie' },
              { model: Theatre, as: 'theatre' }
            ]
          },
          {
            model: FoodOrder,
            as: 'foodOrder',
            include: [
              {
                model: FoodOrderItem,
                as: 'items',
                include: [{ model: FoodItem, as: 'foodItem' }]
              }
            ]
          }
        ]
      });

      // Fire-and-forget email (do not fail booking if email fails)
      try {
        const { subject, html, text } = buildBookingEmail({ userName: user.name, booking: fullBooking });
        const emailResult = await sendBookingConfirmationEmail({
          to: user.email,
          subject,
          html,
          text,
        });

        if (emailResult?.skipped) {
          console.log(`📭 Booking email skipped (${emailResult.reason}) for ${user.email}`);
        } else {
          console.log(`📧 Booking email queued for ${user.email} (messageId: ${emailResult?.messageId || 'n/a'})`);
        }
      } catch (err) {
        console.warn('⚠️ Booking email failed:', err?.message || err);
      }

      return fullBooking;
    },
    applyPromo: async (_, { code, amount }) => {
      if (code === 'CINE10') {
         return { valid: true, discount: amount * 0.1, message: '10% discount applied!' };
      }
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    },
    cancelBooking: async (_, { bookingId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await sequelize.transaction(async (t) => {
        const booking = await Booking.findOne({
          where: { id: bookingId, userId: user.id },
          include: [
            {
              model: FoodOrder,
              as: 'foodOrder',
              include: [
                {
                  model: FoodOrderItem,
                  as: 'items',
                  include: [{ model: FoodItem, as: 'foodItem' }]
                }
              ]
            }
          ],
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (!booking) throw new Error('Booking not found');

        await booking.update({ status: 'cancelled' }, { transaction: t });
        await Seat.update(
          { isBooked: false },
          { where: { showId: booking.showId, seatNumber: booking.seats }, transaction: t }
        );

        if (booking.foodOrder && booking.foodOrder.status !== 'cancelled') {
          for (const item of booking.foodOrder.items || []) {
            if (item.foodItem) {
              item.foodItem.availableQuantity = Number(item.foodItem.availableQuantity) + Number(item.quantity);
              await item.foodItem.save({ transaction: t });
            }
          }
          await booking.foodOrder.update({ status: 'cancelled' }, { transaction: t });
        }
      });

      return true;
    }
  }
};

module.exports = resolvers;
