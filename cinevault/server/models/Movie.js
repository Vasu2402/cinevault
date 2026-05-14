const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 10 },
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  poster: {
    type: DataTypes.STRING(500),
  },
  language: {
    type: DataTypes.STRING(50),
    defaultValue: 'English',
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
  },
  cast: {
    type: DataTypes.TEXT, // comma-separated
  },
  director: {
    type: DataTypes.STRING(150),
  },
  trailer: {
    type: DataTypes.STRING(500),
  },
  tmdbId: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('now', 'upcoming'),
    defaultValue: 'now',
  },
}, {
  tableName: 'movies',
  timestamps: true,
});

module.exports = Movie;
