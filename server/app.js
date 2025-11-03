require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const os = require('os');

// Debug environment variables (safe summary only)
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const medicalRecordRoutes = require('./routes/medicalRecord');
const reminderRoutes = require('./routes/reminder');
const healthTipRoutes = require('./routes/healthTip');
const chatbotRoutes = require('./routes/chatbot');
const aiRoutes = require('./routes/ai');
const demoMode = require('./middleware/demoMode');

// Create Express app
const app = express();

// Trust proxy for deployments (fixes rate limiter warning)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.noupe.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'blob:', 'https://www.noupe.com'],
    connectSrc: ["'self'", 'https://www.noupe.com'],
    frameSrc: ["'self'", 'https://www.noupe.com']
  }
}));

// Determine writable upload directory
const isVercel = !!process.env.VERCEL;
const uploadDir = isVercel
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, 'uploads');

// Ensure uploads directory exists (only where writable)
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Uploads directory could not be ensured:', uploadDir, e?.message);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Common middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files when available (not persisted on serverless)
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', demoMode, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/health-tips', healthTipRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
  });
});

// Mongo connection (cached)
const MONGODB_URI = process.env.MONGODB_URI || '';
let mongoConnection = null;

async function ensureDbConnected() {
  if (mongoConnection) return mongoConnection;
  // Skip connection if no URI is provided (allow demo mode / serverless health to be fast)
  if (!MONGODB_URI) return null;
  try {
    mongoConnection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    mongoConnection = null;
    console.log('⚠️  MongoDB connection failed quickly (proceeding in demo mode)');
  }
  return mongoConnection;
}

module.exports = { app, ensureDbConnected };
