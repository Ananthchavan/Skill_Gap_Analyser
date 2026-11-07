import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import Analysis from '../models/analysis.js';
import { processAnalysisInBackground } from './analysisProcessor.js';

// Connection - BullMQ
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// Default job options
export const JOB_OPTIONS = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 100 },
};

// Queue
export const analysisQueue = new Queue('analysis', { connection });

// Worker (runs the actual pipeline)
// concurrency: 2

const worker = new Worker(
    'analysis',
    async (job) => {
        const { analysisId } = job.data;
        await Analysis.findByIdAndUpdate(analysisId, { $inc: { attempts: 1 } });
        await processAnalysisInBackground(analysisId, job);
    },
    {
        connection,
        concurrency: 2,
        lockDuration: 10 * 60 * 1_000,
    }
);

// Worker event handlers
worker.on('completed', (job) => {
    console.log(`[Queue] Job ${job.id} completed (analysisId: ${job.data.analysisId})`);
});

worker.on('failed', async (job, err) => {
    if (!job) return;

    const { analysisId } = job.data;
    const isLastAttempt = job.attemptsMade >= JOB_OPTIONS.attempts;

    console.error(
        `[Queue] Job ${job.id} failed (attempt ${job.attemptsMade}/${JOB_OPTIONS.attempts})`,
        `analysisId: ${analysisId}`,
        `stage: ${err.stage ?? 'unknown'}`,
        err.message
    );

    if (isLastAttempt) {
        try {
            await Analysis.findByIdAndUpdate(analysisId, {
                status: 'failed',
                failedReason: err.message ?? 'Unknown error',
                failedStage: err.stage ?? null,
            });
            console.log(`[Queue] Marked analysis ${analysisId} as permanently failed.`);
        } catch (dbErr) {
            console.error(`[Queue] Could not update failed status in DB:`, dbErr.message);
        }
    }
});

worker.on('error', (err) => {
    console.error('[Queue] Worker error:', err.message);
});

console.log('[Queue] BullMQ worker started (concurrency: 2)');
