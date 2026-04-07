import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//test123
// Load environment variables FIRST
dotenv.config({ path: './.env' });

// Now import and initialize modules that depend on env vars
// Use a wrapper to ensure dotenv is loaded first
const startServer = async () => {
  // Import modules after dotenv loads
  const { default: connectDB } = await import('./config/DB.js');
  const musicRoutes = (await import('./routes/MusicRoute.js')).default;
  const AdminRoutes = (await import('./routes/AdminRoutes.js')).default;
  const courseRoutes = (await import('./routes/CourseRoutes.js')).default;
  const userRoutes = (await import('./routes/UserRoutes.js')).default;
  const userDashboardRoutes = (await import('./routes/UserDashboardRoutes.js')).default;
  const uploadRoutes = (await import('./routes/UploadRoutes.js')).default;
  
  // Load passport configuration conditionally
  // Use a try-catch block since we're importing conditionally
  let passport = null;
  try {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
      console.log('Google OAuth credentials found - loading passport...');
      const passportModule = await import('passport');
      passport = passportModule.default;
      await import('./config/passport.js');
      console.log('Passport with Google OAuth loaded successfully');
    } else {
      console.log('Google OAuth not configured - skipping passport initialization');
    }
  } catch (err) {
    console.warn('Passport initialization skipped or failed:', err.message);
  }
  
  // Load auth routes (they'll work without passport - just won't have Google OAuth)
  const authRoutes = (await import('./routes/AuthRouters.js')).default;
  
  const session = (await import('express-session')).default;
  const cookieParser = (await import('cookie-parser')).default;

  const app = express();
  const PORT = process.env.PORT || 5000;

  // Body parsing middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  app.use(cookieParser());

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      }
    })
  );

  // Conditionally use passport if available
  if (passport) {
    app.use(passport.initialize());
    app.use(passport.session());
  }

  // Health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString()
    });
  });

  // Route mounting
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/music', musicRoutes);
  app.use('/api/user', userDashboardRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/admin', AdminRoutes);

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  // Database connection and server start
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
