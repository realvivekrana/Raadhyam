import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/DB.js';

 

import authRoutes from './routers/AuthRouters.js';
import musicRoutes from './routers/MusicRoute.js'
import AdminRoutes from './routers/AdminRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());



app.use('/api', authRoutes);
app.use('/api', musicRoutes);
app.use('/api', AdminRoutes);



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
});
