import { z } from 'zod';
import User from '../models/user.js';
import { fetchGithubSnapshot } from '../services/githubService.js';

// GET /api/github/status
/**
 * Returns a lightweight status object — never the full snapshot data.
 */
export async function getStatus(req, res) {
    try {
        const user = await User.findById(req.user._id)
            .select('githubUsername githubSnapshot.fetchedAt')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.json({
            username: user.githubUsername ?? null,
            fetchedAt: user.githubSnapshot?.fetchedAt ?? null,
            hasSnapshot: !!(user.githubSnapshot?.fetchedAt),
        });
    } catch (err) {
        console.error('[GitHub] getStatus error:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

// POST /api/github/refresh
/**
 * Re-fetches the GitHub snapshot for the user's saved githubUsername.
 */
export async function refreshSnapshot(req, res) {
    try {
        const user = await User.findById(req.user._id)
            .select('githubUsername')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (!user.githubUsername) {
            return res.status(400).json({
                error: 'No GitHub username saved. Run an analysis with a GitHub URL first.',
            });
        }

        const data = await fetchGithubSnapshot(user.githubUsername);
        const fetchedAt = new Date();

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    'githubSnapshot.data': data,
                    'githubSnapshot.fetchedAt': fetchedAt,
                },
            },
            { runValidators: false }
        );

        return res.json({ fetchedAt });
    } catch (err) {
        // Rate-limit error thrown by githubService
        if (
            err.message?.toLowerCase().includes('rate limit') ||
            err.status === 429 ||
            err.status === 403
        ) {
            return res.status(429).json({
                error: 'GitHub API rate limit reached. Please wait a while and try again.',
            });
        }

        console.error('[GitHub] refreshSnapshot error:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

// DELETE /api/github/snapshot
/**
 * Privacy option: clears githubSnapshot and githubUsername so the user
 */
export async function deleteSnapshot(req, res) {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    githubSnapshot: '',
                    githubUsername: '',
                },
            },
            { runValidators: false }
        );

        return res.sendStatus(200);
    } catch (err) {
        console.error('[GitHub] deleteSnapshot error:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
