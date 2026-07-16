import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    githubUrl: {
        type: String,
        required: true,
    },
    targetRole: {
        type: String,
        required: true,
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    studyHours: {
        type: Number,
        required: true,
    },
    weeksDuration: {
        type: Number,
        enum: [2, 4, 8, 12],
        required: true,
    },
    resumeText: {
        type: String,
        required: true,
    },
    selfAttestedSkills: {
        type: [String],
        default: [],
    },
    githubData: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    aiRoadmap: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    aiAnalysis: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    completedTaskIds: {
        type: [String],
        default: []
    },
}, { timestamps: true });

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;