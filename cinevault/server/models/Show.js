const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Show = sequelize.define('Show', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'movies', key: 'id' },
  },
  theatreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'theatres', key: 'id' },
  },
  time: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 250.00,
  },
  premiumPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 450.00,
  },
}, {
  tableName: 'shows',
  timestamps: true,
});

module.exports = Show;
