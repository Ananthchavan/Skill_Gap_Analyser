import Analysis from '../models/analysis.js';
import { fetchAndFilterRepos } from './githubService.js';
import { generateAnalysis } from './aiService.js';

export async function processAnalysisInBackground(analysisId) {
    try {
        const analysis = await Analysis.findById(analysisId);
        if (!analysis) throw new Error('Analysis document not found.');

        console.log(`Starting background processing for Analysis ID: ${analysisId}`);

        analysis.status = 'processing';
        await analysis.save();

        const repoData = await fetchAndFilterRepos(analysis.githubUrl);

        analysis.githubData = repoData;
        await analysis.save();

        console.log(`Successfully saved GitHub data for Analysis ID: ${analysisId}`);

    } catch (error) {
        console.error(`Background processing failed for Analysis ID ${analysisId}:`, error);
        await Analysis.findByIdAndUpdate(analysisId, { status: 'failed' });
    }
}

export async function processAnalysisInBackground(analysisId) {
    try {
        const analysis = await Analysis.findById(analysisId);
        if (!analysis) throw new Error('Analysis document not found.');

        analysis.status = 'processing';
        await analysis.save();

        //fetch github data
        const repoData = await fetchAndFilterRepos(analysis.githubUrl);
        analysis.githubData = repoData;
        await analysis.save();
        console.log(`Saved GitHub data for ID: ${analysisId}`);

        //generate analysis
        const analysisResult = await generateAnalysis(analysis);
        analysis.aiAnalysis = analysisResult;
        await analysis.save();
        console.log(`Saved AI Analysis for ID: ${analysisId}`);

        //generate the roadmap

    } catch (error) {
        console.error(`Background processing failed for ID ${analysisId}:`, error);
        await Analysis.findByIdAndUpdate(analysisId, { status: 'failed' });
    }
}