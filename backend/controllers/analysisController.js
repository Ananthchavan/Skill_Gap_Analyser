// <=================== ANALYSIS CONTROLLER ===================>

import Analysis from '../models/analysis.js';
import { processAnalysisInBackground } from '../services/analysisProcessor.js';
import { createRequire } from 'module';
import { extractNonCodeableSkills, generateMilestoneQuiz } from '../services/aiServices.js';

// pdf-parse doesn't support ESM imports, so we use require
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/*
GET /api/analysis/dashboard
Grabs all analyses for the logged-in user, minus the heavy fields to keep it snappy.
*/
export const getDashboard = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'You must be logged in to view the dashboard.' });
        }

        // strip big fields so the dashboard loads fast
        const analyses = await Analysis.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('-aiRoadmap -githubData -resumeText');

        res.status(200).json(analyses);
    } catch (error) {
        console.error('Error fetching dashboard analyses:', error);
        res.status(500).json({ error: 'An error occurred while loading the dashboard.' });
    }
};

/*
POST /api/analysis/new
Creates a new analysis record then kicks off the background processor without blocking the response.
*/
export const createAnalysis = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'You must be logged in.' });
        }

        const {
            targetRole,
            experienceLevel,
            githubUrl,
            jobDescription,
            studyHours,
            weeksDuration,
            selfAttestedSkills
        } = req.body;

        // selfAttestedSkills arrives as a JSON string from the form, so we parse it carefully
        let parsedSkills = [];
        try {
            if (selfAttestedSkills) {
                parsedSkills = JSON.parse(selfAttestedSkills);
            }
        } catch (e) {
            console.error('Failed to parse selfAttestedSkills:', e);
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Resume pdf is required' });
        }

        // pull the raw text out of the uploaded PDF buffer
        const pdfData = await pdfParse(req.file.buffer);
        const ResumeText = pdfData.text;

        const newAnalysis = await Analysis.create({
            user: req.user._id,
            githubUrl,
            targetRole,
            experienceLevel,
            jobDescription,
            studyHours,
            weeksDuration,
            resumeText: ResumeText,
            selfAttestedSkills: parsedSkills,
            status: 'pending',
        });

        // respond immediately so the user isn't waiting on the heavy AI processing
        res.status(201).json({
            message: 'Analysis created successfully',
            analysisId: newAnalysis._id,
        });

        // fire-and-forget — errors here won't bubble up to the user
        processAnalysisInBackground(newAnalysis._id).catch(err => {
            console.error('Unhandled error in background process:', err);
        });

    } catch (error) {
        console.error('Error processing analysis:', error);
        res.status(500).json({ error: 'An error occurred while saving the analysis.' });
    }
};

/*
POST /api/analysis/extract-skills
Runs the job description through AI to pull out soft/non-codeable skills before the form is submitted.
*/
export const extractSkills = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription || jobDescription.trim().length < 20) {
            return res.status(400).json({ error: 'Please enter a valid Job Description before scanning.' });
        }

        const skills = await extractNonCodeableSkills(jobDescription);
        return res.status(200).json({ skills });
    } catch (error) {
        console.error('Error in /api/analysis/extract-skills:', error);
        return res.status(500).json({ error: 'Failed to extract skills from Job Description.' });
    }
};

/*
GET /api/analysis/:id
Fetches the full details of a single analysis — only if it belongs to the requesting user.
*/
export const getAnalysisById = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const analysis = await Analysis.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        res.status(200).json(analysis);
    } catch (error) {
        console.error('Error fetching analysis details:', error);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
};

/*
PATCH /api/analysis/:id/progress
Silently syncs the user's completed task IDs in the background so progress is never lost.
*/
export const updateProgress = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { completedTaskIds } = req.body;

        if (!Array.isArray(completedTaskIds)) {
            return res.status(400).json({ error: 'completedTaskIds must be an array' });
        }

        const updatedAnalysis = await Analysis.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: { completedTaskIds } },
            { new: true }
        );

        if (!updatedAnalysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        res.status(200).json({
            success: true,
            completedTaskIds: updatedAnalysis.completedTaskIds
        });
    } catch (error) {
        console.error('Error updating roadmap progress:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
};

/*
PATCH /api/analysis/:id/resources
Saves the curated resources a user pinned for a specific day in their Smart Space.
*/
export const updateResources = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { dayId, resources } = req.body;

        if (!dayId || !Array.isArray(resources)) {
            return res.status(400).json({ error: 'Invalid payload: dayId and resources array are required' });
        }

        const updatedAnalysis = await Analysis.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: { [`savedResources.${dayId}`]: resources } },
            { new: true }
        );

        if (!updatedAnalysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        res.status(200).json({
            success: true,
            savedResources: updatedAnalysis.savedResources
        });
    } catch (error) {
        console.error('Error updating smart space resources:', error);
        res.status(500).json({ error: 'Failed to save resources' });
    }
};

/*
PATCH /api/analysis/:id/quiz-score
Saves or updates a user's score AND full quiz data for a specific milestone quiz.
*/
export const saveQuizScore = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // NEW: We are now extracting questions and userAnswers from the request
        const { weekNumber, score, questions, userAnswers } = req.body;

        if (weekNumber === undefined || score === undefined) {
            return res.status(400).json({ error: 'weekNumber and score are required in the request body.' });
        }

        const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
        if (!analysis) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        // Check if a score for this week already exists
        const existingScoreIndex = analysis.quizScores.findIndex(q => q.weekNumber === weekNumber);

        if (existingScoreIndex !== -1) {
            // Update existing score (retake)
            analysis.quizScores[existingScoreIndex].score = score;
            analysis.quizScores[existingScoreIndex].questions = questions || [];
            analysis.quizScores[existingScoreIndex].userAnswers = userAnswers || [];
        } else {
            // Add new score with payload
            analysis.quizScores.push({
                weekNumber,
                score,
                questions: questions || [],
                userAnswers: userAnswers || []
            });
        }

        await analysis.save();

        res.status(200).json({
            success: true,
            quizScores: analysis.quizScores
        });
    } catch (error) {
        console.error('Error updating quiz score:', error);
        res.status(500).json({ error: 'Failed to save quiz score.' });
    }
};

/*
DELETE /api/analysis/:id
Permanently removes an analysis — scoped to the owner so no one can delete someone else's work.
*/
export const deleteAnalysis = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const deleted = await Analysis.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Analysis not found or not authorized' });
        }

        res.status(200).json({ message: 'Analysis deleted successfully' });
    } catch (error) {
        console.error('Error deleting analysis:', error);
        res.status(500).json({ error: 'Failed to delete analysis' });
    }
};

/*
POST /api/analysis/:id/quiz/generate
Generates a quiz on-the-fly using Groq based on the specific week's curriculum.
*/
export const generateQuiz = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        const { weekNumber } = req.body;

        if (!weekNumber) {
            return res.status(400).json({ error: 'weekNumber is required in the request body.' });
        }

        //fetch the users roadmap from MongoDB
        const analysis = await Analysis.findOne({ _id: id, user: req.user._id });
        if (!analysis || !analysis.aiRoadmap) {
            return res.status(404).json({ error: 'Analysis or Roadmap not found.' });
        }

        let curriculumData;
        let isFinal = false;

        //isolate the specific data Groq needs to test the user on
        if (weekNumber === 'final') {
            curriculumData = analysis.aiRoadmap.weeks;
            isFinal = true;
        } else {
            const week = analysis.aiRoadmap.weeks.find(w => w.weekNumber === parseInt(weekNumber));
            if (!week) {
                return res.status(400).json({ error: `Week ${weekNumber} not found in the roadmap.` });
            }
            curriculumData = week;
        }

        //call Groq
        const questions = await generateMilestoneQuiz(analysis.targetRole, curriculumData, isFinal);

        //return the generated quiz to the frontend
        res.status(200).json({
            success: true,
            quiz: questions
        });

    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz.' });
    }
};
