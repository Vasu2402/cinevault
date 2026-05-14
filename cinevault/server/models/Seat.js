const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  showId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'shows', key: 'id' },
  },
  seatNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('standard', 'premium'),
    defaultValue: 'standard',
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lockedBy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  lockExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'seats',
  timestamps: true,
});

module.exports = Seat;
