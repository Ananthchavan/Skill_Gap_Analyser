import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load .env with absolute path BEFORE any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import { passport, configurePassport } from './passport.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';

//configure passport after dotenv has loaded env
configurePassport();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'a_very_secret_string',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' Connected to MongoDB'))
    .catch((err) => console.error(' MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Skill-Gap Analyzer backend is running.' });
});

// <=================== AUTH ROUTES =================>
// triggers the github login
app.use('/auth', authRoutes);
// returns current user
app.use('/api', authRoutes);

// <=================== ANALYSIS ROUTES =================>
app.use('/api/analysis', analysisRoutes);

app.listen(PORT, () => {
    console.log(` Server listening on http://localhost:${PORT}`);
});