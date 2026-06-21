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

import { z } from 'zod';

export const aiRoadmapSchema = z.object({
    weeks: z.array(z.object({
        weekNumber: z.number().describe("The sequential number of the week (1 to 4)."),
        weeklyTheme: z.string().describe("A macro-level focus or goal for this week (e.g., 'Mastering Asynchronous State')."),
        weeklyMilestone: z.string().describe("A tangible micro-project or technical outcome the user must build by the end of this week."),
        days: z.array(z.object({
            dayNumber: z.number().min(1).max(7).describe("The day of the week (1 through 7)."),
            coreTopic: z.string().describe("The specific technical concept for the day."),
            tasks: z.array(z.string()).describe("Actionable study tasks or coding exercises. Scale the complexity based on their weekly hour budget."),
            suggestedBuildExercise: z.string().describe("A quick, 1-sentence practical prompt of what code to write today.")
        })).length(7).describe("Exactly 7 days of structured daily content for this week.")
    })).min(2).max(4).describe("The roadmap must contain exactly the number of weeks requested (2 or 4).")
});