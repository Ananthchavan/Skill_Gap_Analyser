import { z } from 'zod';

export const aiAnalysisSchema = z.object({
    overallMatch: z.number().min(0).max(100).describe("A realistic integer (0-100) representing how close the user's current skills match the target role. Be strict. 100% means they are perfectly ready to be hired today."),
    executiveSummary: z.string().describe("A 2-3 sentence brutally honest summary speaking directly to the user. Highlight their main technical advantage and their biggest critical blind spot."),
    assessedSkills: z.array(z.object({
        skillName: z.string().describe("The name of the technology or skill (e.g., 'React', 'Docker')."),
        currentLevel: z.number().min(0).max(100).describe("Their estimated current proficiency (0-100) based on their GitHub and resume for this skill."),
        targetLevel: z.number().min(0).max(100).describe("The required proficiency (0-100) for the target role.")
    })).describe("An array of 4 to 6 core skills most relevant to the target role, assessing where they are versus where they need to be."),
    criticalMissingSkills: z.array(z.object({
        skillName: z.string(),
        importance: z.enum(['High', 'Medium', 'Low']),
        reason: z.string().describe("One brief sentence explaining why this is critical for the target role.")
    })).max(4).describe("Up to 4 specific and relevant skills they are completely missing that the job description demands.")
});