require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Debug environment variables
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

// Trust proxy for development (fixes rate limiter warning)
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

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded files (with proper security)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', demoMode, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/health-tips', healthTipRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
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

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-storage';

// Start server first, then try to connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:3000`);
  console.log(`Backend API: http://localhost:${PORT}`);
});

// Try to connect to MongoDB (optional for demo)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB - Database features enabled');
  })
  .catch((err) => {
    console.log('⚠️  MongoDB connection failed - Website will run in demo mode');
    console.log('   Install MongoDB or use MongoDB Atlas for full database features');
    console.log('   The website frontend will work perfectly without database!');
  });