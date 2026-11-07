import Analysis from '../models/analysis.js';
import { fetchAndFilterRepos } from './githubService.js';
import { generateAnalysis, generateTechnicalRoadmap } from './aiServices.js';

function stageError(stage, originalError) {
    const err = new Error(originalError.message);
    err.stage = stage;
    err.stack = originalError.stack;
    return err;
}

/*
  Main pipeline - BullMQ
*/
export async function processAnalysisInBackground(analysisId, job = null) {
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) throw new Error('Analysis document not found.');

    console.log(`[Queue] Starting pipeline for Analysis ID: ${analysisId}`);

    // ── Stage 1: GitHub fetch
    analysis.status = 'processing';
    await analysis.save();
    if (job) await job.updateProgress(5);

    let repoData;
    try {
        repoData = await fetchAndFilterRepos(analysis.githubUrl, analysis.experienceLevel);
    } catch (err) {
        throw stageError('github', err);
    }

    analysis.githubData = repoData;
    await analysis.save();
    console.log(`[Queue] ✓ GitHub data saved for ID: ${analysisId}`);
    if (job) await job.updateProgress(35);

    // Stage 2: AI Analysis
    let analysisResult;
    try {
        analysisResult = await generateAnalysis(analysis);
    } catch (err) {
        throw stageError('ai_analysis', err);
    }

    analysis.aiAnalysis = analysisResult;
    await analysis.save();
    console.log(`[Queue] ✓ AI analysis saved for ID: ${analysisId}`);
    if (job) await job.updateProgress(65);

    // Stage 3: AI Roadmap
    let roadmapResult;
    try {
        roadmapResult = await generateTechnicalRoadmap(analysis);
    } catch (err) {
        throw stageError('ai_roadmap', err);
    }

    analysis.aiRoadmap = roadmapResult;
    analysis.status = 'completed';
    await analysis.save();
    console.log(`[Queue] Pipeline complete for ID: ${analysisId}`);
    if (job) await job.updateProgress(100);
}
