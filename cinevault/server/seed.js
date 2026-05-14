require('dotenv').config();
const { sequelize } = require('./config/db');
const { User, Movie, Theatre, Show, Seat, FoodItem } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    // Force sync — drops and recreates all tables
    await sequelize.sync({ force: true });
    console.log('📊 Tables recreated');

    // ── Users ──────────────────────────────────────
    const hashedPass = await bcrypt.hash('password123', 12);
    const users = await User.bulkCreate([
      { name: 'John Doe', email: 'john@example.com', password: hashedPass },
      { name: 'Jane Smith', email: 'jane@example.com', password: hashedPass },
      { name: 'Demo User', email: 'demo@cinevault.com', password: hashedPass },
    ]);
    console.log(`👤 ${users.length} users seeded`);

    // ── Movies ─────────────────────────────────────
    const movies = await Movie.bulkCreate([
      {
        title: 'Quantum Horizon',
        genre: 'Sci-Fi',
        rating: 8.7,
        duration: 148,
        description: 'In a future where quantum computing has unlocked parallel dimensions, a brilliant physicist discovers that someone is deliberately collapsing realities. She must race across dimensions to save not just her world, but every possible version of existence.',
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-03-15',
        cast: 'Emma Stone, Oscar Isaac, Cate Blanchett',
        director: 'Denis Villeneuve',
      },
      {
        title: 'Midnight Requiem',
        genre: 'Thriller',
        rating: 8.3,
        duration: 132,
        description: 'A retired detective receives a mysterious invitation to solve one last case — a murder that hasn\'t happened yet. As the clock ticks toward midnight, she must navigate a web of deception where everyone is a suspect and nothing is as it seems.',
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-03-20',
        cast: 'Viola Davis, Jake Gyllenhaal, Lupita Nyong\'o',
        director: 'David Fincher',
      },
      {
        title: 'Echoes of Eternity',
        genre: 'Drama',
        rating: 9.1,
        duration: 165,
        description: 'Spanning three generations across three continents, this epic follows a family\'s journey through love, loss, and the unbreakable bonds that transcend time. A meditation on what we inherit and what we choose to leave behind.',
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-02-28',
        cast: 'Denzel Washington, Saoirse Ronan, Dev Patel',
        director: 'Barry Jenkins',
      },
      {
        title: 'Neon Samurai',
        genre: 'Action',
        rating: 8.5,
        duration: 140,
        description: 'In Neo-Tokyo 2085, a disgraced samurai with cybernetic enhancements is pulled back into the underground fighting circuit when his daughter is kidnapped by a powerful tech conglomerate. Blends traditional bushido with futuristic action.',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-04-01',
        cast: 'Hiroyuki Sanada, Ana de Armas, Idris Elba',
        director: 'Chad Stahelski',
      },
      {
        title: 'The Last Canvas',
        genre: 'Drama',
        rating: 8.8,
        duration: 125,
        description: 'An aging painter suffering from memory loss creates his final masterpiece — a painting that seems to shift and change depending on who views it. As art critics and collectors descend, the truth behind the painting reveals a lifetime of hidden secrets.',
        poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-03-10',
        cast: 'Anthony Hopkins, Florence Pugh, Timothée Chalamet',
        director: 'Wes Anderson',
      },
      {
        title: 'Vortex Rising',
        genre: 'Sci-Fi',
        rating: 7.9,
        duration: 155,
        description: 'When a massive electromagnetic storm threatens to tear apart Earth\'s magnetic field, a ragtag team of scientists and astronauts must journey to the planet\'s core to restart the dynamo effect before it\'s too late.',
        poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-04-05',
        cast: 'Chris Hemsworth, Zendaya, John Boyega',
        director: 'Christopher Nolan',
      },
      {
        title: 'Whispers in the Fog',
        genre: 'Horror',
        rating: 8.1,
        duration: 118,
        description: 'A family moves to a remote coastal town shrouded in perpetual fog. Strange whispers begin emanating from the mist, and one by one, the townsfolk start disappearing. The new arrivals must uncover the ancient secret before the fog claims them too.',
        poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-03-25',
        cast: 'Toni Collette, Anya Taylor-Joy, Robert Pattinson',
        director: 'Ari Aster',
      },
      {
        title: 'Golden Hour',
        genre: 'Romance',
        rating: 8.4,
        duration: 128,
        description: 'Two strangers meet during the golden hour on a bridge in Paris. What begins as a chance encounter becomes a love story that unfolds across seasons, testing whether destiny is something you find or something you create.',
        poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
        language: 'English',
        releaseDate: '2026-02-14',
        cast: 'Ryan Gosling, Margot Robbie, Omar Sy',
        director: 'Damien Chazelle',
      },
    ]);
    console.log(`🎬 ${movies.length} movies seeded`);

    // ── Theatres ────────────────────────────────────
    const theatres = await Theatre.bulkCreate([
      { name: 'CineVault IMAX', location: 'Downtown City Center, Screen 1', totalSeats: 100 },
      { name: 'CineVault Gold', location: 'Phoenix Mall, Level 3', totalSeats: 80 },
      { name: 'CineVault Premiere', location: 'Orion Mall, East Wing', totalSeats: 100 },
    ]);
    console.log(`🏛️  ${theatres.length} theatres seeded`);

    // ── Food Items (per theatre) ───────────────────
    const baseMenu = [
      { name: 'Classic Popcorn (Salted)', description: 'Freshly popped salted popcorn', price: 180, availableQuantity: 120 },
      { name: 'Caramel Popcorn', description: 'Sweet caramel-coated popcorn', price: 220, availableQuantity: 80 },
      { name: 'Nachos + Cheese Dip', description: 'Crispy nachos with cheese dip', price: 250, availableQuantity: 60 },
      { name: 'Soft Drink (Coke)', description: '500ml chilled soft drink', price: 120, availableQuantity: 150 },
      { name: 'Water Bottle', description: '500ml mineral water', price: 60, availableQuantity: 200 },
    ];

    const foodRows = theatres.flatMap((t) =>
      baseMenu.map((m) => ({
        theatreId: t.id,
        name: m.name,
        description: m.description,
        price: m.price,
        availableQuantity: m.availableQuantity,
        isActive: true,
      }))
    );
    const foodItems = await FoodItem.bulkCreate(foodRows);
    console.log(`🍿 ${foodItems.length} food items seeded`);

    // ── Shows ──────────────────────────────────────
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const times = ['10:00 AM', '1:30 PM', '4:45 PM', '7:30 PM', '10:15 PM'];
    const showData = [];

    movies.forEach((movie, idx) => {
      const theatre = theatres[idx % theatres.length];
      dates.forEach((date, di) => {
        const timesToUse = times.slice(0, 3 + (di % 3));
        timesToUse.forEach((time) => {
          showData.push({
            movieId: movie.id,
            theatreId: theatre.id,
            date,
            time,
            price: 250 + (idx % 3) * 50,
            premiumPrice: 450 + (idx % 3) * 50,
          });
        });
      });
    });

    const shows = await Show.bulkCreate(showData);
    console.log(`🎟️  ${shows.length} shows seeded`);

    // ── Seats ──────────────────────────────────────
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 10;
    const seatData = [];

    for (const show of shows) {
      for (const row of rows) {
        for (let num = 1; num <= seatsPerRow; num++) {
          seatData.push({
            showId: show.id,
            seatNumber: `${row}${num}`,
            type: ['A', 'B'].includes(row) ? 'premium' : 'standard',
            isBooked: false,
          });
        }
      }
    }

    // Bulk insert in chunks to avoid memory issues
    const chunkSize = 500;
    let totalSeats = 0;
    for (let i = 0; i < seatData.length; i += chunkSize) {
      const chunk = seatData.slice(i, i + chunkSize);
      await Seat.bulkCreate(chunk);
      totalSeats += chunk.length;
    }
    console.log(`💺 ${totalSeats} seats seeded`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Demo accounts:');
    console.log('   john@example.com / password123');
    console.log('   jane@example.com / password123');
    console.log('   demo@cinevault.com / password123');
    console.log('\n🎫 Promo codes: CINE10, FIRST50, BLOCKBUSTER, WEEKEND100\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
