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
import multer from 'multer';
import session from 'express-session';
import { passport, configurePassport } from './passport.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Analysis from './models/analysis.js';
import { processAnalysisInBackground } from './services/analysisProcessor.js';

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

// intercepts the pdf into memory buffer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'), false);
        }
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' Connected to MongoDB'))
    .catch((err) => console.error(' MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Skill-Gap Analyzer backend is running.' });
});

// <=================== AUTH ROUTES =================>

// Triggers GitHub login — account picker is forced via authorizationParams override in passport.js
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Redirect after successful login
app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.CLIENT_URL}/login`
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/NewAnalysis`);
    }
);

// Check current logged-in user
app.get('/api/current_user', (req, res) => {
    if (!req.user) return res.status(401).json(null);
    res.json(req.user);
});

// Logout Route
app.get('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect(process.env.CLIENT_URL);
    });
});

// <===================== ANALYSIS ROUTES ======================>

//Fetch all the analysis
app.get('/api/analysis/dashboard', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'You must be logged in to view the dashboard.' });
        }

        //by stripping the large json files,the dashboard loads faster
        const analyses = await Analysis.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('-aiRoadmap -githubData -resumeText');
        res.status(200).json(analyses);

    } catch (error) {
        console.error('Error fetching dashboard analyses:', error);
        res.status(500).json({ error: 'An error occurred while loading the dashboard.' });
    }
});

//New Analysis Route
app.post('/api/analysis/new', upload.single('resume'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'You must be logged in.' });
        }

        const {
            targetRole,
            experienceLevel,
            githubUrl,
            jobDescription,
            studyHours,
            weeksDuration
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Resume pdf is required' });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const ResumeText = pdfData.text;

        const newAnalysis = await Analysis.create({
            user: req.user._id,
            githubUrl: githubUrl,
            targetRole: targetRole,
            experienceLevel: experienceLevel,
            jobDescription: jobDescription,
            studyHours: studyHours,
            weeksDuration: weeksDuration,
            resumeText: ResumeText,
            status: 'pending',
        });

        res.status(201).json({
            message: 'Analysis created successfully',
            analysisId: newAnalysis._id,
        });

        processAnalysisInBackground(newAnalysis._id).catch(err => {
            console.error('Unhandled error in background process:', err);
        });

    } catch (error) {
        console.error('Error processing analysis:', error);
        res.status(500).json({ error: 'An error occurred while saving the analysis.' });
    }
});

app.listen(PORT, () => {
    console.log(` Server listening on http://localhost:${PORT}`);
});