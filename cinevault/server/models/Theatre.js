const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Theatre = sequelize.define('Theatre', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
}, {
  tableName: 'theatres',
  timestamps: true,
});

module.exports = Theatre;
