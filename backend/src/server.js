/**
 * ============================================
 *  NeonPulse Music Backend - Main Server
 * ============================================
 * 
 * Production-ready Express server for the Mood-Based
 * Music Recommendation System.
 * 
 * Architecture: MVC + Service Layer
 * Database: MongoDB with Mongoose
 * Features: NLP mood classification, caching, rate limiting,
 *           pagination, search, and detailed logging
 * 
 * @author NeonPulse Team
 * @version 2.0.0
 */

// =============================================
//  LOAD ENVIRONMENT VARIABLES (must be first!)
// =============================================
const dotenv = require('dotenv');
dotenv.config();

// =============================================
//  IMPORTS
// =============================================
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Config
const connectDB = require('./config/db');
const logger = require('./config/logger');

// Middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Routes
const moodRoutes = require('./routes/moodRoutes');
const songRoutes = require('./routes/songRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Services (for fallback)
const { classifyMood } = require('./services/moodService');
const { getRecommendations } = require('./services/recommendationService');

// =============================================
//  APP INITIALIZATION
// =============================================
const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
//  GLOBAL MIDDLEWARE
// =============================================

// CORS - Allow frontend origins
app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (using Morgan piped into Winston)
app.use(morgan('dev', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// =============================================
//  HEALTH CHECK ROUTE
// =============================================
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'NeonPulse Music API is running 🚀',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /',
      // Auth
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      forgotPassword: 'POST /api/auth/forgot-password',
      resetPassword: 'POST /api/auth/reset-password/:token',
      profile: 'GET /api/auth/me',
      // Dashboard
      dashboard: 'GET /api/dashboard',
      trackListen: 'POST /api/dashboard/listen',
      trackMood: 'POST /api/dashboard/mood',
      toggleFavorite: 'POST /api/dashboard/favorite',
      listeningHistory: 'GET /api/dashboard/history',
      // Music
      mood: 'POST /api/mood',
      supportedMoods: 'GET /api/mood/supported',
      recommendations: 'POST /api/recommendations',
      recommendByMood: 'GET /api/recommend/:mood',
      smartRecommend: 'POST /api/recommend/smart',
      songs: 'GET /api/songs',
      addSong: 'POST /api/songs',
      spotifyStatus: 'GET /api/spotify/status',
    },
  });
});

// =============================================
//  API ROUTES
// =============================================

// Auth endpoints (register, login, forgot password, profile)
app.use('/api/auth', authRoutes);

// Dashboard endpoints (stats, history, favorites)
app.use('/api/dashboard', dashboardRoutes);

// Mood processing endpoints
app.use('/api/mood', moodRoutes);

// Song CRUD endpoints
app.use('/api/songs', songRoutes);

// Recommendation endpoints (includes POST /api/recommendations for frontend compatibility)
app.use('/api/recommendations', recommendationRoutes);

// New REST-style recommendations
app.use('/api/recommend', recommendationRoutes);

// =============================================
//  LEGACY / COMPATIBILITY ENDPOINTS
// =============================================
// These maintain backward compatibility with the existing frontend

// Spotify status mock (frontend calls this on load)
app.get('/api/spotify/status', (req, res) => {
  res.json({
    configured: true,
    available: false,
    message: 'Spotify is not connected. Using NeonPulse intelligent mood-based recommendations powered by MongoDB.',
  });
});

// =============================================
//  ERROR HANDLING
// =============================================

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last middleware)
app.use(errorHandler);

// =============================================
//  DATABASE CONNECTION & SERVER START
// =============================================

/**
 * Fallback dummy tracks for when MongoDB is unavailable
 * Ensures the frontend always gets data to display
 */
const FALLBACK_TRACKS = [
  {
    id: 'fallback-1',
    title: 'Neon Nights',
    artist: 'Static Pulse',
    genres: ['Synthwave', 'Electronic'],
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'fallback-2',
    title: 'Cyber Dreams',
    artist: 'Velvet Echo',
    genres: ['Cyberpunk', 'Chill'],
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'fallback-3',
    title: 'Electric Horizon',
    artist: 'The Circuit',
    genres: ['Electronic', 'Dance'],
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'fallback-4',
    title: 'Midnight Drive',
    artist: 'Kavinsky',
    genres: ['Synthwave', 'Driving'],
    image: 'https://images.unsplash.com/photo-1517430529647-90cce5b4fb15?w=500&h=500&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];

let isDBConnected = false;

const startServer = async () => {
  // Try to connect to MongoDB
  const connection = await connectDB();
  isDBConnected = !!connection;

  if (!isDBConnected) {
    logger.warn('⚠️ Running WITHOUT MongoDB - using fallback data');
    logger.warn('⚠️ To use MongoDB, make sure it is running and MONGODB_URI is correct in .env');

    // Override the recommendations endpoint to serve fallback data
    // This ensures the frontend works even without MongoDB
    app.post('/api/recommendations', (req, res) => {
      const mood = req.body?.mood || 'chilled';
      setTimeout(() => {
        res.json({
          recommendations: FALLBACK_TRACKS,
          explanation: `🔌 MongoDB not connected. Showing ${FALLBACK_TRACKS.length} fallback tracks for "${mood}" mood. Connect MongoDB and run "npm run seed" for the full experience.`,
          source: 'fallback',
        });
      }, 500);
    });
  }

  // Start Express server
  app.listen(PORT, () => {
    logger.info('═'.repeat(50));
    logger.info(`🚀 NeonPulse Backend v2.0.0`);
    logger.info(`🌐 Server: http://localhost:${PORT}`);
    logger.info(`📦 Database: ${isDBConnected ? 'MongoDB Connected ✅' : 'Fallback Mode ⚠️'}`);
    logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info('═'.repeat(50));
    
    if (isDBConnected) {
      logger.info('📝 API Endpoints:');
      logger.info('   POST /api/mood              → Classify mood from text');
      logger.info('   GET  /api/mood/supported     → List all supported moods');
      logger.info('   POST /api/recommendations    → Get song recommendations');
      logger.info('   GET  /api/recommend/:mood     → Get recommendations by mood');
      logger.info('   POST /api/recommend/smart     → Text → Mood → Songs');
      logger.info('   GET  /api/songs              → List all songs');
      logger.info('   POST /api/songs              → Add a song');
      logger.info('   POST /api/songs/bulk         → Add songs in bulk');
      logger.info('   GET  /api/spotify/status     → Spotify API status');
      logger.info('═'.repeat(50));
    }
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`❌ Unhandled Rejection: ${err.message}`);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
