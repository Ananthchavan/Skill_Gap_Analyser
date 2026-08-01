import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const BCRYPT_ROUNDS = 10;

//  GET /api/current_user
//  Returns the currently authenticated user from session
export const getCurrentUser = (req, res) => {
    if (!req.user) return res.status(401).json(null);
    res.status(200).json(req.user);
};

//  POST /auth/register
//  Creates a new local (email/password) account
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ── Basic validation ──
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address.' });
        }

        // ── Check for duplicate email ──
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // ── Hash password and create user ──
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            authProvider: 'local',
        });
        const savedUser = await newUser.save();

        // ── Log in immediately after register (establishes session) ──
        req.login(savedUser, (err) => {
            if (err) {
                console.error('Session error after register:', err);
                return res.status(500).json({ error: 'Registration succeeded but sign-in failed. Please log in.' });
            }
            res.status(201).json(savedUser);
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
};

//  POST /auth/login
//  Handled by passport.authenticate('local') in the route;
//  this controller runs AFTER successful authentication.
export const loginUser = (req, res) => {
    // passport has already verified credentials and called req.login()
    res.status(200).json(req.user);
};

//  POST /auth/logout  (changed from GET to POST for security)
export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
