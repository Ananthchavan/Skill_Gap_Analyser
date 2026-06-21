import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { aiAnalysisSchema } from '../schemas/aiSchemas.js';

export async function generateAnalysis(analysisData) {
    try {
        const { output: aiAnalysisResult } = await generateText({
            model: google('gemini-2.5-flash'),
            output: Output.object({
                schema: aiAnalysisSchema
            }),

            system: `You are a brutally honest Senior Engineering Manager conducting a technical skill-gap analysis. 
            Your goal is to evaluate the user's current skills against their target role. 
            Do not be overly polite or give artificial high scores. If they lack critical skills, state it clearly.
            Analyze the provided GitHub repository data, resume text, and job description to determine their true proficiency levels.`,
            prompt: `
                Target Role: ${analysisData.targetRole}
                Expected Experience Level: ${analysisData.experienceLevel}
                
                [Target Job Description]
                ${analysisData.jobDescription}
                
                [User's Resume Text]
                ${analysisData.resumeText}
                
                [User's Analyzed GitHub Portfolio Data]
                ${JSON.stringify(analysisData.githubData, null, 2)}
            `,
        });

        return aiAnalysisResult;
    } catch (error) {
        console.error('Error generating AI Executive Analysis:', error);
        throw new Error('AI Generation for Dashboard Metrics Failed.');
    }
}