const { Op } = require('sequelize');
const { Booking, Show, Movie, Theatre, Seat } = require('../models');

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Show, as: 'show',
          include: [
            { model: Movie, as: 'movie' },
            { model: Theatre, as: 'theatre' },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const seats = Array.isArray(booking.seats) ? booking.seats : JSON.parse(booking.seats);
    await Seat.update(
      { isBooked: false },
      { where: { showId: booking.showId, seatNumber: { [Op.in]: seats } } }
    );
    await booking.update({ status: 'cancelled' });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
