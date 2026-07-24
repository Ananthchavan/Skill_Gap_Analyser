import express from 'express';
import { passport } from '../passport.js';
import { getCurrentUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// <===================  AUTH ROUTES ===================>

// Triggers GitHub OAuth login (prompt: select_account is enforced in passport.js)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback — on success redirects to frontend callback page
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.CLIENT_URL}/login`
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
    }
);

// Returns the currently authenticated user session
router.get('/current_user', getCurrentUser);

// Logs out the current user
router.get('/logout', logoutUser);

export default router;
