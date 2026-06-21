import Analysis from '../models/analysis.js';
import { fetchAndFilterRepos } from './githubService.js';
import { generateAnalysis, generateTechnicalRoadmap } from './aiService.js';

export async function processAnalysisInBackground(analysisId) {
    try {
        const analysis = await Analysis.findById(analysisId);
        if (!analysis) throw new Error('Analysis document not found.');

        console.log(`Starting background processing for Analysis ID: ${analysisId}`);

        //start the process
        analysis.status = 'processing';
        await analysis.save();

        //fetch and format github data
        const repoData = await fetchAndFilterRepos(analysis.githubUrl);
        analysis.githubData = repoData;
        await analysis.save();
        console.log(`Successfully saved GitHub data for Analysis ID: ${analysisId}`);

        //generate analysis
        const analysisResult = await generateAnalysis(analysis);
        analysis.aiAnalysis = analysisResult;
        await analysis.save();
        console.log(`Saved AI Analysis for ID: ${analysisId}`);

        //generate roadmap
        const roadmapResult = await generateTechnicalRoadmap(analysis);
        analysis.aiRoadmap = roadmapResult;

        //mark the process as done
        analysis.status = 'completed';
        await analysis.save();
        console.log(`Successfully completed complete AI generation pipeline for ID: ${analysisId}`);

    } catch (error) {
        console.error(`Background processing failed for ID ${analysisId}:`, error);
        //update status as failed
        await Analysis.findByIdAndUpdate(analysisId, { status: 'failed' });
    }
}