import User from '../models/user.js';
import { fetchGithubSnapshot } from './githubService.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Extracts a GitHub username from a URL.
 * Returns null if the URL is falsy or doesn't match.
 */
function extractUsername(githubUrl) {
    if (!githubUrl) return null;
    const match = githubUrl.match(/github\.com\/([^/]+)/);
    return match ? match[1] : null;
}

export async function getGithubDataForAnalysis(user, githubUrl) {
    const urlUsername = extractUsername(githubUrl);

    if (!urlUsername) {
        throw new Error('No valid GitHub URL provided for analysis.');
    }

    const isSameUser =
        !user.githubUsername ||
        user.githubUsername.toLowerCase() === urlUsername.toLowerCase();

    if (isSameUser) {
        // Check whether the cached snapshot is fresh enough
        const isSnapshotFresh =
            user.githubSnapshot?.data &&
            user.githubSnapshot?.fetchedAt &&
            Date.now() - new Date(user.githubSnapshot.fetchedAt).getTime() < SEVEN_DAYS_MS;

        if (isSnapshotFresh) {
            console.log(`[Snapshot] Using cached GitHub snapshot for user ${user._id} (${urlUsername})`);
            return user.githubSnapshot.data;
        }

        // Fetch fresh and cache it
        console.log(`[Snapshot] Fetching fresh GitHub snapshot for user ${user._id} (${urlUsername})`);
        const data = await fetchGithubSnapshot(urlUsername);

        await User.findByIdAndUpdate(user._id, {
            githubUsername: urlUsername,
            githubSnapshot: { data, fetchedAt: new Date() },
        });

        return data;
    }

    // Different username — fetch fresh but don't save
    console.log(`[Snapshot] Fetching GitHub data for third-party username: ${urlUsername} (not saving)`);
    return fetchGithubSnapshot(urlUsername);
}
