require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { connectDB, sequelize } = require('./config/db');
const createApolloServer = require('./graphql');
const initSeatSocket = require('./sockets/seatSocket');
const { verifySmtpConnection } = require('./utils/mailer');

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const bookingRoutes = require('./routes/bookings');

// Import models to register associations
require('./models');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'client')));

// REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connect to database
    await connectDB();

    // Sync models (create tables if not exist)
    await sequelize.sync({ alter: true });
    console.log('📊 Database synced');

    // Setup GraphQL
    await createApolloServer(app);

    // Verify SMTP config (non-fatal)
    const smtpStatus = await verifySmtpConnection();
    if (smtpStatus?.skipped) {
      console.log(`📭 SMTP not configured (${smtpStatus.reason})`);
    } else if (smtpStatus?.ok) {
      console.log('✅ SMTP verified');
    } else {
      console.warn(`⚠️ SMTP verify failed: ${smtpStatus?.error || 'unknown error'}`);
    }

    // Setup Socket.io
    initSeatSocket(io);
    console.log('🔌 Socket.io initialized');

    // Start listening
    server.listen(PORT, () => {
      console.log(`\n🎬 CineVault Server running on http://localhost:${PORT}`);
      console.log(`📡 GraphQL Playground: http://localhost:${PORT}/graphql`);
      console.log(`🌐 Client: http://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

let isInitialized = false;

if (process.env.VERCEL) {
  // On Vercel, export a function to handle requests statelessly
  module.exports = async (req, res) => {
    if (!isInitialized) {
      try {
        await connectDB();
        await sequelize.sync({ alter: true });
        await createApolloServer(app);
        isInitialized = true;
      } catch (error) {
        console.error('❌ Vercel Initialization failed:', error);
        return res.status(500).json({ error: 'Server Initialization Failed' });
      }
    }
    return app(req, res);
  };
} else {
  // Local or traditional server deployment (Railway, etc.)
  start();
}
