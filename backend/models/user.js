import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    avatarUrl: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    generationsUsed: {
        type: Number,
        default: 0
    },
    allowedGenerations: {
        type: Number,
        default: 3
    },
    limitResetDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
}, { timestamps: true });

export default mongoose.model('User', userSchema);


