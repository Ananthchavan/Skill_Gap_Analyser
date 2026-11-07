import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import Analysis from '../models/analysis.js';
import { processAnalysisInBackground } from './analysisProcessor.js';

// ── Connection ────────────────────────────────────────────────────────────────
// BullMQ requires an explicit ioredis instance in ESM environments.
// maxRetriesPerRequest: null is required by BullMQ — it manages its own retries.
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});

// ── Default job options ───────────────────────────────────────────────────────
export const JOB_OPTIONS = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 }, // 5s → 10s → 20s
    removeOnComplete: { count: 50 },
    removeOnFail:    { count: 100 },
};

// ── Queue (used by the controller to enqueue jobs) ────────────────────────────
export const analysisQueue = new Queue('analysis', { connection });

// ── Worker (runs the actual pipeline) ────────────────────────────────────────
/*
  concurrency: 2  — at most 2 analyses run simultaneously, preventing
                     RAM / API-rate spikes from overlapping jobs.
*/
const worker = new Worker(
    'analysis',
    async (job) => {
        const { analysisId } = job.data;
        // Update the attempt counter in Mongo so the UI can see retries
        await Analysis.findByIdAndUpdate(analysisId, { $inc: { attempts: 1 } });
        await processAnalysisInBackground(analysisId, job);
    },
    {
        connection,
        concurrency: 2,
        // Hard timeout: 10 minutes per job. Covers even a 12-week roadmap
        // (6 chunks × ~90s each) with headroom.
        lockDuration: 10 * 60 * 1_000,
    }
);

// ── Worker event handlers ─────────────────────────────────────────────────────
worker.on('completed', (job) => {
    console.log(`[Queue] Job ${job.id} completed (analysisId: ${job.data.analysisId})`);
});

worker.on('failed', async (job, err) => {
    if (!job) return; // defensive — job can be undefined on certain edge cases

    const { analysisId } = job.data;
    const isLastAttempt = job.attemptsMade >= JOB_OPTIONS.attempts;

    console.error(
        `[Queue] Job ${job.id} failed (attempt ${job.attemptsMade}/${JOB_OPTIONS.attempts})`,
        `analysisId: ${analysisId}`,
        `stage: ${err.stage ?? 'unknown'}`,
        err.message
    );

    // Only permanently mark as failed after all retries are exhausted
    if (isLastAttempt) {
        try {
            await Analysis.findByIdAndUpdate(analysisId, {
                status:       'failed',
                failedReason: err.message  ?? 'Unknown error',
                failedStage:  err.stage    ?? null,
            });
            console.log(`[Queue] Marked analysis ${analysisId} as permanently failed.`);
        } catch (dbErr) {
            console.error(`[Queue] Could not update failed status in DB:`, dbErr.message);
        }
    }
});

worker.on('error', (err) => {
    // Catches connection-level errors (e.g., Redis went down)
    console.error('[Queue] Worker error:', err.message);
});

console.log('[Queue] BullMQ worker started (concurrency: 2)');
