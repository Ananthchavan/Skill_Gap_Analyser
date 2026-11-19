import { z } from 'zod';

// --- Roadmap Generation Schema ---
const roadmapTaskSchema = z.object({
    taskDescription: z.string().describe("Concise task description, 12 words or fewer."),
    estimatedHours: z.number().describe("Estimated hours to complete the task."),
    associatedSkill: z.string().describe("Must exactly match a skill name from the skill gap profile.")
});

const roadmapDaySchema = z.object({
    dayNumber: z.number().int().min(1).max(7).describe("Day of the week (1–7)."),
    topics: z.array(z.string()).length(2).describe("Exactly 2 topic strings covered on this day."),
    tasks: z.array(roadmapTaskSchema).length(2).describe("Exactly 2 tasks for this day.")
});

const roadmapWeekSchema = z.object({
    weekNumber: z.number().int().min(1).describe("The sequential week number in the overall plan."),
    weekFocus: z.string().describe("Short focus summary, 8 words or fewer."),
    days: z.array(roadmapDaySchema).length(7).describe("Exactly 7 day objects, one per day of the week.")
});

export const roadmapChunkSchema = z.object({
    weeks: z.array(roadmapWeekSchema).describe("Array of week objects for the requested chunk.")
});

// --- Quiz Generation Schema ---
export const quizQuestionSchema = z.object({
    questionText: z.string().describe("The full text of the multiple-choice question."),
    options: z.array(z.string()).length(4).describe("Exactly 4 answer options."),
    correctAnswer: z.string().describe("Must be an exact string match to one of the 4 items in the 'options' array."),
    explanation: z.string().describe("A clear, educational explanation for why the correct answer is right and why the others are wrong.")
});

export const milestoneQuizSchema = z.object({
    questions: z.array(quizQuestionSchema)
        .min(1)
        .describe("Array of quiz questions. 5–8 questions for a milestone quiz, 15 for a final assessment.")
});

// --- Analysis Schema ---
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
        reason: z.string().describe("One brief sentence explaining why this is critical for the target role."),
        currentLevel: z.number().describe("Always set this to 0 since the skill is completely missing."),
        targetLevel: z.number().min(0).max(100).describe("The required proficiency (0-100) that the job description demands for this missing skill.")
    })).max(4).describe("Up to 4 specific and relevant skills they are completely missing that the job description demands.")
});
