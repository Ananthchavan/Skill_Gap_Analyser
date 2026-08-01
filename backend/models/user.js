import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // ── GitHub OAuth fields (optional for local users) ──
    githubId: {
        type: String,
        sparse: true,   // allows multiple docs without githubId (local users)
        unique: true,
    },
    accessToken: {
        type: String,   // only set for GitHub users
    },
    refreshToken: {
        type: String,
    },
    profileUrl: {
        type: String,
    },

    // ── Shared fields ──
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        sparse: true,   // allows GitHub users without email; unique when present
        unique: true,
    },
    avatarUrl: {
        type: String,
    },

    // ── Local auth fields ──
    passwordHash: {
        type: String,   // bcrypt hash; only set for local users
    },
    authProvider: {
        type: String,
        enum: ['github', 'local', null],  // null allowed for legacy GitHub users without this field
        default: 'github',
        // NOT required — existing GitHub users in the DB may not have this field
    },

    // ── Usage tracking ──
    generationsUsed: {
        type: Number,
        default: 0,
    },
    allowedGenerations: {
        type: Number,
        default: 3,
    },
    limitResetDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
