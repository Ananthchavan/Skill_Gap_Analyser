import { Octokit } from 'octokit';
import { scoreRepo, resolveLevel, monthsAgo, LEVEL_CONFIG } from './repoScoring.js';


const MAX_RETRIES = 2;

const octokit = new Octokit({
    auth: process.env.GITHUB_PAT,
    throttle: {
        onRateLimit: (retryAfter, options, _octokit, retryCount) => {
            console.warn(
                `[GitHub] Primary rate limit for ${options.method} ${options.url}. ` +
                `Retry ${retryCount + 1}/${MAX_RETRIES} in ${retryAfter}s.`
            );
            return retryCount < MAX_RETRIES;   // true = retry, false = throw
        },
        onSecondaryRateLimit: (retryAfter, options, _octokit, retryCount) => {
            console.warn(
                `[GitHub] Secondary rate limit for ${options.method} ${options.url}. ` +
                `Retry ${retryCount + 1}/${MAX_RETRIES} in ${retryAfter}s.`
            );
            return retryCount < MAX_RETRIES;
        },
    },
});

async function runWithConcurrency(tasks, concurrency = 8) {
    if (tasks.length === 0) return [];
    const results = new Array(tasks.length);
    let next = 0;

    async function worker() {
        while (next < tasks.length) {
            const i = next++;
            results[i] = await tasks[i]();
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(concurrency, tasks.length) }, worker)
    );
    return results;
}

// Constants
const MANIFEST_FILES = {
    JavaScript: 'package.json',
    TypeScript: 'package.json',
    HTML: 'package.json',
    CSS: 'package.json',
    Vue: 'package.json',
    Python: 'requirements.txt',
    Go: 'go.mod',
    Ruby: 'Gemfile',
    Java: 'pom.xml',
};

const JS_FRAMEWORK_KEYWORDS = [
    'react', 'next', 'vue', 'nuxt', 'angular', 'svelte', 'solid',
    'express', 'fastify', 'koa', 'hapi', 'nestjs',
    'redux', 'zustand', 'mobx', 'recoil', 'jotai',
    'react-router', 'react-query', 'tanstack',
    'vite', 'webpack', 'rollup',
    'tailwindcss', 'styled-components', 'emotion',
    'prisma', 'mongoose', 'sequelize', 'typeorm',
    'socket.io', 'graphql', 'apollo',
    'jest', 'vitest', 'cypress', 'playwright',
    'electron', 'expo', 'react-native',
];

const TIER_1_LIMIT = 3;     // top 3 repos get deep README
const README_LIMIT = 13000; // 13 000-character circuit breaker
const REPO_CAP = 30;    // max repos to deep-dive per analysis

function isRateLimitError(err) {
    return err?.status === 403 || err?.status === 429;
}

export async function fetchAndFilterRepos(githubUrl, experienceLevel) {
    const usernameMatch = githubUrl.match(/github\.com\/([^/]+)/);
    if (!usernameMatch) throw new Error('Invalid GitHub URL provided.');
    const username = usernameMatch[1];

    const level = resolveLevel(experienceLevel);
    const { cutoffMonths } = LEVEL_CONFIG[level];

    try {
        try {
            const { data: rateData } = await octokit.rest.rateLimit.get();
            const core = rateData.resources.core;
            console.log(
                `[GitHub] Quota: ${core.remaining}/${core.limit} remaining ` +
                `(resets ${new Date(core.reset * 1000).toISOString()})`
            );
            if (core.remaining < 50) {
                throw new Error('GitHub rate limit reached. Please try again later.');
            }
        } catch (err) {
            if (err.message.includes('rate limit')) throw err;
            console.warn('[GitHub] Could not fetch rate limit info:', err.message);
        }

        const { data: repos } = await octokit.rest.repos.listForUser({
            username,
            per_page: 100,
            sort: 'updated',
        });

        const nonForks = repos.filter((r) => !r.fork);

        const baseRepos = nonForks.map((repo) => ({
            name: repo.name,
            description: repo.description || 'No description provided.',
            language: repo.language,
            topics: repo.topics || [],
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            size: repo.size,
            pushed_at: repo.pushed_at,
            html_url: repo.html_url,
            isMajor: false,
            created_at: repo.created_at,
            has_pages: repo.has_pages,
            homepage: repo.homepage,
            archived: repo.archived,
        }));

        // Drop tiny / stale repos
        const now = Date.now();
        const candidates = baseRepos.filter(
            (r) => r.size > 10 && monthsAgo(r.pushed_at, now) < cutoffMonths
        );

        const poolForRanking = candidates.length > 0 ? candidates : baseRepos;
        const candidateNames = new Set(poolForRanking.map((r) => r.name));

        // Cap pool before expensive API calls
        const preScoredPool = poolForRanking
            .map((repo) => ({ repo, score: scoreRepo(repo, level, now) }))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(b.repo.pushed_at).getTime() - new Date(a.repo.pushed_at).getTime();
            });

        const cappedPool = preScoredPool.slice(0, REPO_CAP).map(({ repo }) => repo);
        console.log(`[GitHub] Deep-diving ${cappedPool.length} repos (capped at ${REPO_CAP}).`);

        // Deep dive: languages + manifest (batched, 8 at a time) ─
        const deepDiveTasks = cappedPool.map((baseData) => async () => {
            // deep dive 1: fetch language breakdown
            try {
                const { data: languages } = await octokit.rest.repos.listLanguages({
                    owner: username,
                    repo: baseData.name,
                });
                baseData.languages = languages;
            } catch (err) {
                if (isRateLimitError(err)) throw err;
                // ignore — scorer treats absent field as 0
            }

            // deep dive 2: scan manifest
            const manifestPath =
                MANIFEST_FILES[baseData.language] ??
                (baseData.language == null ? 'package.json' : null);

            if (manifestPath) {
                try {
                    const { data: pkgData } = await octokit.rest.repos.getContent({
                        owner: username,
                        repo: baseData.name,
                        path: manifestPath,
                    });

                    if (pkgData?.content) {
                        const decoded = Buffer.from(pkgData.content, 'base64').toString('utf-8');

                        if (manifestPath === 'package.json') {
                            const parsed = JSON.parse(decoded);
                            const allDeps = Object.keys({
                                ...(parsed.dependencies || {}),
                                ...(parsed.devDependencies || {}),
                            });

                            const noiseWords = ['@types/', 'eslint', 'prettier', 'husky', 'lint-staged', 'nodemon', 'ts-node', 'jest', 'vitest'];
                            const cleanDeps = allDeps
                                .filter(dep => !noiseWords.some(noise => dep.includes(noise)))
                                .slice(0, 20);

                            baseData.detectedFrameworks = cleanDeps;

                            const detectedSignals = cleanDeps.filter(dep =>
                                JS_FRAMEWORK_KEYWORDS.some(kw => dep.toLowerCase().includes(kw))
                            );

                            if (detectedSignals.length > 0) {
                                baseData.frameworkSignals = `Detected frameworks/libraries in package.json: ${detectedSignals.join(', ')}`;
                                baseData.isMajor = true;
                            }

                        } else if (manifestPath === 'requirements.txt') {
                            baseData.detectedFrameworks = decoded.split('\n').map(line => line.split('==')[0].trim()).filter(line => line && !line.startsWith('#')).slice(0, 15);
                            if (baseData.detectedFrameworks.length > 0) baseData.isMajor = true;
                        } else if (manifestPath === 'go.mod') {
                            baseData.detectedFrameworks = decoded.split('\n').filter(line => line.includes('\t')).map(line => line.trim().split(' ')[0]).slice(0, 15);
                            if (baseData.detectedFrameworks.length > 0) baseData.isMajor = true;
                        } else {
                            baseData.detectedFrameworks = decoded.substring(0, 300);
                            baseData.isMajor = true;
                        }
                    }
                } catch (err) {
                    if (isRateLimitError(err)) throw err;
                    // No manifest found or not parseable — skip silently
                }
            }
        });

        await runWithConcurrency(deepDiveTasks, 8);

        // Final scoring after deep dive
        const scored = cappedPool
            .map((repo) => ({ repo, score: scoreRepo(repo, level, now) }))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(b.repo.pushed_at).getTime() - new Date(a.repo.pushed_at).getTime();
            });

        // Fetch README for tier-1 repos only (batched)
        const readmeTasks = scored.slice(0, TIER_1_LIMIT).map(({ repo: baseData }) => async () => {
            baseData.isMajor = true;
            try {
                const { data: readmeData } = await octokit.rest.repos.getReadme({
                    owner: username,
                    repo: baseData.name,
                });
                if (readmeData?.content) {
                    const decoded = Buffer.from(readmeData.content, 'base64').toString('utf-8');
                    baseData.readme =
                        decoded.length > README_LIMIT
                            ? decoded.substring(0, README_LIMIT) + '...'
                            : decoded;
                }
            } catch (err) {
                if (isRateLimitError(err)) throw err;
                // no readme — skip silently
            }
        });

        await runWithConcurrency(readmeTasks, 3);

        // Assemble final output
        return baseRepos.map((baseData) => {
            if (!candidateNames.has(baseData.name)) return baseData;
            const entry = scored.find(({ repo }) => repo.name === baseData.name);
            if (entry) baseData.score = entry.score;
            return baseData;
        });

    } catch (error) {
        // Surface rate-limit exhaustion with a clear, actionable message
        if (isRateLimitError(error) || error.message?.includes('rate limit')) {
            const msg = 'GitHub rate limit reached. Please try again later.';
            console.error('[GitHub]', msg);
            throw new Error(msg);
        }
        console.error('[GitHub] Error fetching repos:', error.message);
        throw new Error('Failed to retrieve GitHub repository data.');
    }
}
