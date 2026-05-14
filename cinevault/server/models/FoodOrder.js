const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FoodOrder = sequelize.define('FoodOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'bookings', key: 'id' },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  theatreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'theatres', key: 'id' },
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'confirmed',
  },
}, {
  tableName: 'food_orders',
  timestamps: true,
});

module.exports = FoodOrder;
