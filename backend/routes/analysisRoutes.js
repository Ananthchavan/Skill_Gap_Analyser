import express from 'express';
import multer from 'multer';
import {
    getDashboard,
    createAnalysis,
    extractSkills,
    getAnalysisById,
    updateProgress,
    updateResources,
    deleteAnalysis,
    saveQuizScore
} from '../controllers/analysisController.js';

const router = express.Router();

// intercepts the uploaded PDF into memory so we never touch the disk
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'), false);
        }
    }
});

// <=================== ANALYSIS ROUTES ===================>

// dashboard — fetch all analyses for the logged-in user (light payload)
router.get('/dashboard', getDashboard);

// new analysis — parses the PDF then spawns a background job
router.post('/new', upload.single('resume'), createAnalysis);

// extract skills — quick AI scan of the job description before form submission
router.post('/extract-skills', extractSkills);

// view details — full analysis data for a single record
router.get('/:id', getAnalysisById);

// progress sync — silently saves completed task IDs without blocking the UI
router.patch('/:id/progress', updateProgress);

// smart space — saves the pinned resources for a given roadmap day
router.patch('/:id/resources', updateResources);

// quiz generation
router.post('/:id/quiz/generate', generateQuiz);

// save quiz score
router.patch('/:id/quiz-score', saveQuizScore);

// delete — permanently removes the analysis (owner-scoped)
router.delete('/:id', deleteAnalysis);

export default router;
