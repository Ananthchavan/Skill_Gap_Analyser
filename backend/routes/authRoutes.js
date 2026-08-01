import express from 'express';
import { passport } from '../passport.js';
import { getCurrentUser, registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// ──────────────────────────────────────────────────
//  GitHub OAuth
// ──────────────────────────────────────────────────

// Redirect to GitHub (select_account enforced in passport)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.CLIENT_URL}/login`
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
    }
);

// ──────────────────────────────────────────────────
//  Local (Email / Password) Auth
// ──────────────────────────────────────────────────

// Register a new local account
router.post('/register', registerUser);

// Login with email + password
router.post('/login',
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ error: info?.message || 'Invalid credentials.' });
            }
            req.login(user, (loginErr) => {
                if (loginErr) return next(loginErr);
                return loginUser(req, res);
            });
        })(req, res, next);
    }
);

// ──────────────────────────────────────────────────
//  Shared
// ──────────────────────────────────────────────────

router.get('/current_user', getCurrentUser);

// Changed to POST for CSRF-safety (GET logout can be triggered by <img> etc.)
router.post('/logout', logoutUser);

// Keep GET logout for backward-compat (e.g., any existing link)
router.get('/logout', logoutUser);

export default router;
