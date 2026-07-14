import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { aiAnalysisSchema } from '../schemas/aiSchema.js';
import { aiRoadmapSchema } from '../schemas/aiSchema.js';
import { groq } from '@ai-sdk/groq';

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

            CRITICAL RULE ON SELF-ATTESTED SKILLS: The user will provide a list of 'Self-Attested Skills'. If a skill required by the Job Description conceptually matches or overlaps with ANY of these self-attested skills (e.g., 'Agile Development' overlaps with 'Agile / Scrum Methodologies'), you MUST consider the user proficient. You are STRICTLY FORBIDDEN from putting conceptually matching skills into the 'criticalMissingSkills' array.
            CRITICAL DATA INSTRUCTION: When analyzing the GitHub repository data, you are strictly forbidden from only looking at the top-level 'language' key (e.g., JavaScript or TypeScript). You MUST deeply inspect the 'dependencies' and 'dependenciesRaw' objects for every repository. Modern frameworks (React, Express, Next.js, Angular) and libraries (Tailwind, Redux, Mongoose) will ONLY appear in these dependency lists. If a framework or tool is listed in their dependencies, you MUST credit them with proficiency in that skill.

            IMPORTANT: For the 'criticalMissingSkills' array, you must determine the required 'targetLevel' (0-100) based on the job description. Because these skills are missing, you MUST hardcode the user's 'currentLevel' to 0 for every item in this array.`,
            prompt: `
                Target Role: ${analysisData.targetRole}
                Expected Experience Level: ${analysisData.experienceLevel}
                
                [Target Job Description]
                ${analysisData.jobDescription}
                
                [User's Resume Text]
                ${analysisData.resumeText}

                [User's Self-Attested Skills]
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
            model: groq('llama3-70b-8192'),
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
            3. Actionable & Direct: Focus heavily on closing the missing skills found in their profile relative to the job description. Provide precise technical topics.
            4. Task Tagging: Every single daily task MUST include an "associatedSkill" tag. This tag must perfectly match the exact spelling of one of the skills listed in the user's profile context below. Do not invent new skill names.`,

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