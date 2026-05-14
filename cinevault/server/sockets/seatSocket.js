const { Seat } = require('../models');
const { verifyToken } = require('../config/jwt');

// Active seat lock timers
const lockTimers = new Map();

const initSeatSocket = (io) => {
  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const user = verifyToken(token);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.email} (${socket.id})`);

    // Join a show room
    socket.on('join:show', (showId) => {
      socket.join(`show:${showId}`);
      console.log(`👤 ${socket.user.email} joined show:${showId}`);
    });

    // Leave a show room
    socket.on('leave:show', (showId) => {
      socket.leave(`show:${showId}`);
      console.log(`👤 ${socket.user.email} left show:${showId}`);
    });

    // Lock a seat
    socket.on('seat:lock', async ({ showId, seatNumber }) => {
      try {
        const seat = await Seat.findOne({ where: { showId, seatNumber } });
        if (!seat) return socket.emit('seat:error', { message: 'Seat not found' });
        if (seat.isBooked) return socket.emit('seat:error', { message: 'Seat already booked' });

        const now = new Date();
        if (seat.lockedBy && seat.lockedBy !== String(socket.user.id) && seat.lockExpiry > now) {
          return socket.emit('seat:error', { message: 'Seat locked by another user' });
        }

        const lockExpiry = new Date(now.getTime() + 5 * 60 * 1000);
        await seat.update({ lockedBy: String(socket.user.id), lockExpiry });

        // Broadcast lock to all users in the show room
        io.to(`show:${showId}`).emit('seat:locked', {
          seatNumber,
          lockedBy: String(socket.user.id),
          lockExpiry: lockExpiry.toISOString(),
        });

        // Auto-release lock after 5 minutes
        const timerKey = `${showId}-${seatNumber}`;
        if (lockTimers.has(timerKey)) clearTimeout(lockTimers.get(timerKey));

        const timer = setTimeout(async () => {
          const currentSeat = await Seat.findOne({ where: { showId, seatNumber } });
          if (currentSeat && !currentSeat.isBooked && currentSeat.lockedBy === String(socket.user.id)) {
            await currentSeat.update({ lockedBy: null, lockExpiry: null });
            io.to(`show:${showId}`).emit('seat:released', { seatNumber });
          }
          lockTimers.delete(timerKey);
        }, 5 * 60 * 1000);

        lockTimers.set(timerKey, timer);
      } catch (err) {
        socket.emit('seat:error', { message: err.message });
      }
    });

    // Unlock a seat
    socket.on('seat:unlock', async ({ showId, seatNumber }) => {
      try {
        const seat = await Seat.findOne({ where: { showId, seatNumber } });
        if (!seat) return;
        if (seat.lockedBy !== String(socket.user.id)) return;

        await seat.update({ lockedBy: null, lockExpiry: null });

        const timerKey = `${showId}-${seatNumber}`;
        if (lockTimers.has(timerKey)) {
          clearTimeout(lockTimers.get(timerKey));
          lockTimers.delete(timerKey);
        }

        io.to(`show:${showId}`).emit('seat:released', { seatNumber });
      } catch (err) {
        socket.emit('seat:error', { message: err.message });
      }
    });

    // Seats booked — broadcast permanent booking
    socket.on('seat:booked', ({ showId, seatNumbers }) => {
      io.to(`show:${showId}`).emit('seats:confirmed', { seatNumbers });
      // Clear timers for booked seats
      seatNumbers.forEach((sn) => {
        const timerKey = `${showId}-${sn}`;
        if (lockTimers.has(timerKey)) {
          clearTimeout(lockTimers.get(timerKey));
          lockTimers.delete(timerKey);
        }
      });
    });

    // Disconnect cleanup
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.user.email}`);
      // Release all seats locked by this user
      try {
        const lockedSeats = await Seat.findAll({
          where: { lockedBy: String(socket.user.id), isBooked: false },
        });
        for (const seat of lockedSeats) {
          await seat.update({ lockedBy: null, lockExpiry: null });
          io.to(`show:${seat.showId}`).emit('seat:released', { seatNumber: seat.seatNumber });
          const timerKey = `${seat.showId}-${seat.seatNumber}`;
          if (lockTimers.has(timerKey)) {
            clearTimeout(lockTimers.get(timerKey));
            lockTimers.delete(timerKey);
          }
        }
      } catch (err) {
        console.error('Cleanup error:', err.message);
      }
    });
  });
};

module.exports = initSeatSocket;
