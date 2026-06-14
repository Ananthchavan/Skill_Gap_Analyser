import Analysis from '../models/analysis.js';
import { fetchAndFilterRepos } from './githubService.js';

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

        // AI Generation (next step)


    } catch (error) {
        console.error(`Background processing failed for Analysis ID ${analysisId}:`, error);
        await Analysis.findByIdAndUpdate(analysisId, { status: 'failed' });
    }
}