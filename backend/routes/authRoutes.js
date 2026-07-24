import express from 'express';
import { passport } from '../passport.js';
import { getCurrentUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// <===================  AUTH ROUTES ===================>
// triggers login(select_account is enforced in passport)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth
router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.CLIENT_URL}/login`
    }),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
    }
);

router.get('/current_user', getCurrentUser);

router.get('/logout', logoutUser);

export default router;
