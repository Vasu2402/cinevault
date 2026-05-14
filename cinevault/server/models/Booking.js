const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  showId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'shows', key: 'id' },
  },
  seats: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  promoCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'confirmed',
  },
  bookingRef: {
    type: DataTypes.STRING(20),
    unique: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
});

module.exports = Booking;
