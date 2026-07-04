import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { aiAnalysisSchema } from '../schemas/aiSchema.js';
import { aiRoadmapSchema } from '../schemas/aiSchema.js';

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
            Analyze the provided GitHub repository data, resume text, and job description to determine their true proficiency levels.
            
            IMPORTANT: For the 'criticalMissingSkills' array, you must determine the required 'targetLevel' (0-100) based on the job description. Because these skills are missing, you MUST hardcode the user's 'currentLevel' to 0 for every item in this array.`,
            prompt: `
                Target Role: ${analysisData.targetRole}
                Expected Experience Level: ${analysisData.experienceLevel}
                
                [Target Job Description]
                ${analysisData.jobDescription}
                
                [User's Resume Text]
                ${analysisData.resumeText}

                [User's Self-Attested Skills]
                The user explicitly confirms they possess these skills. You MUST accept these as valid and incorporate them into 'assessedSkills'. DO NOT list them in 'criticalMissingSkills'.
                ${analysisData.selfAttestedSkills && analysisData.selfAttestedSkills.length > 0 ? analysisData.selfAttestedSkills.join(', ') : 'None'}
                
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

export async function generateTechnicalRoadmap(analysisData) {
    try {
        // Calculate the total weekly hours based on their daily input
        const totalWeeklyHours = analysisData.studyHours * 7;

        const { output: roadmapResult } = await generateText({
            model: google('gemini-2.5-flash'),
            output: Output.object({
                schema: aiRoadmapSchema
            }),

            system: `You are an expert Technical Curriculum Engineer and Bootcamp Architect.
            Your job is to generate a highly granular, day-by-day learning schedule tailored precisely to the user's constraints.
            
            CRITICAL CONSTRAINTS:
            1. Total Duration: You MUST generate exactly ${analysisData.weeksDuration} weeks of content.
            2. Weekly Time Budget: The user has exactly ${totalWeeklyHours} hours available in a week (roughly ${analysisData.studyHours} hours/day).
               - If weekly hours are low (< 14 hours/week), keep tasks highly focused on syntax and core concepts. Do not overwhelm them.
               - If weekly hours are high (28+ hours/week), increase the density. Include advanced architecture, testing, and deployment tasks.
            3. Actionable & Direct: Focus heavily on closing the missing skills found in their profile relative to the job description. Provide precise technical topics.`,

            prompt: `
                Target Role: ${analysisData.targetRole}
                Target Seniority/Level: ${analysisData.experienceLevel}
                
                [Time Constraints]
                Requested Roadmap Duration: ${analysisData.weeksDuration} Weeks
                Time Available Per Week: ${totalWeeklyHours} Hours/Week
                
                [Core Profile Context]
                Below is the verified analysis of the user's current strengths and missing skills:
                ${JSON.stringify(analysisData.aiAnalysis, null, 2)}
                
                [Target Job Description]
                ${analysisData.jobDescription}
                
                Generate a sequential, day-by-day roadmap split into structured weeks that bridges their current profile gaps directly to the target role requirements. Do not exceed the requested roadmap duration.
            `,
        });

        return roadmapResult;
    } catch (error) {
        console.error('Error generating AI Roadmap:', error);
        throw new Error('AI Generation for Roadmap Planner Failed.');
    }
}