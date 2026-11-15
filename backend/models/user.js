import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        sparse: true,
        unique: true,
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        sparse: true,
        unique: true,
    },
    avatarUrl: {
        type: String,
    },
    passwordHash: {
        type: String,
    },
    authProvider: {
        type: String,
        enum: ['github', 'local', null],
        default: 'github',
    },
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
    githubUsername: {
        type: String,
    },
    githubSnapshot: {
        data: { type: mongoose.Schema.Types.Mixed },
        fetchedAt: { type: Date },
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
