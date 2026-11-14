import { z } from 'zod';

export const createAnalysisSchema = z.object({
    githubUrl: z
        .string()
        .url('githubUrl must be a valid URL')
        .regex(
            /^https:\/\/github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?$/,
            'githubUrl must be a GitHub profile or repository URL (https://github.com/<user> or /<user>/<repo>)'
        ),
    weeksDuration: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .pipe(
            z.number().int('weeksDuration must be an integer').min(1).max(52)
        ),
    studyHours: z
        .union([z.string(), z.number()])
        .transform((v) => Number(v))
        .pipe(
            z.number().int('studyHours must be an integer').min(1).max(80)
        ),
    jobDescription: z
        .string()
        .min(20, 'jobDescription must be at least 20 characters')
        .max(10000, 'jobDescription must not exceed 10,000 characters'),
});

// updateProgress (PATCH /api/analysis/:id/progress)
export const updateProgressSchema = z.object({
    completedTaskIds: z.array(z.string()).default([]),
});

// updateResources (PATCH /api/analysis/:id/resources)
const resourceItemSchema = z.object({
    title: z.string().max(300).optional(),
    url: z.string().max(2048).optional(),
    type: z.string().max(50).optional(),
    description: z.string().max(500).optional(),
}).passthrough();

export const updateResourcesSchema = z.object({
    dayId: z
        .string()
        .min(1, 'dayId is required')
        .regex(
            /^[A-Za-z0-9_-]+$/,
            'dayId may only contain letters, numbers, hyphens, and underscores'
        ),
    resources: z.array(resourceItemSchema),
});

// saveQuizScore (PATCH /api/analysis/:id/quiz-score)
export const saveQuizScoreSchema = z.object({
    weekNumber: z.union([
        z.number().int().positive(),
        z.literal('final'),
    ]),
    score: z.number().min(0).max(100),
    questions: z.array(z.any()).optional(),
    userAnswers: z.array(z.any()).optional(),
});

