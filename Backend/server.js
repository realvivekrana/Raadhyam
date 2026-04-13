import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import seedAdmin from './seedAdmin.js';

dotenv.config({ path: './.env' });
const startServer = async () => {
  const { default: connectDB } = await import('./config/DB.js');
  const { default: AdminRoutes } = await import('./routes/AdminRoutes.js');
  const { getAllMusicNotes } = await import('./controllers/AdminController.js');
  const { globalErrorHandler, notFoundHandler } = await import('./middlewares/errorHandler.js');
  const musicRoutes = (await import('./routes/MusicRoute.js')).default;
  const courseRoutes = (await import('./routes/CourseRoutes.js')).default;
  const userRoutes = (await import('./routes/UserRoutes.js')).default;
  const userDashboardRoutes = (await import('./routes/UserDashboardRoutes.js')).default;
  const uploadRoutes = (await import('./routes/UploadRoutes.js')).default;
  const mediaRoutes = (await import('./routes/MediaRoutes.js')).default;
  
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
  
  const authRoutes = (await import('./routes/AuthRouters.js')).default;
  
  const session = (await import('express-session')).default;
  const cookieParser = (await import('cookie-parser')).default;

  const app = express();
  const PORT = process.env.PORT || 5000;

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

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/music', musicRoutes);
  app.use('/api/user', userDashboardRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/admin', AdminRoutes);
  app.use('/api/media', mediaRoutes);

  app.get('/api/music-notes', getAllMusicNotes);

  app.use(notFoundHandler);

  app.use(globalErrorHandler);

  await connectDB();
  
  // Seed admin user if not exists (non-fatal)
  try {
    await seedAdmin();
  } catch (err) {
    console.warn('seedAdmin skipped:', err.message);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
