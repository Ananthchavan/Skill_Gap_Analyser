import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
    getStatus,
    refreshSnapshot,
    deleteSnapshot,
} from '../controllers/githubController.js';

const router = express.Router();

// All GitHub routes require an authenticated session
router.use(requireAuth);

// GET  /api/github/status   — returns { username, fetchedAt, hasSnapshot }
router.get('/status', getStatus);

// POST /api/github/refresh  — re-fetches the snapshot for the saved username
router.post('/refresh', refreshSnapshot);

// DELETE /api/github/snapshot — clears snapshot + username (privacy wipe)
router.delete('/snapshot', deleteSnapshot);

export default router;
