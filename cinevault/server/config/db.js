const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support a single DB_URL (e.g. from Railway / Aiven / PlanetScale)
// OR individual DB_HOST / DB_USER / DB_PASS / DB_NAME vars.
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: { rejectUnauthorized: false }, // required by most cloud MySQL providers
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      define: { timestamps: true, underscored: false },
    })
  : new Sequelize(
      process.env.DB_NAME || 'cinevault',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
        define: { timestamps: true, underscored: false },
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected via Sequelize');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Throw instead of process.exit(1) so serverless environments
    // (Vercel, etc.) can handle the error gracefully.
    throw error;
  }
};

module.exports = { sequelize, connectDB };
