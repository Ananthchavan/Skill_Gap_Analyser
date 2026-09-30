import { Octokit } from 'octokit';
import { scoreRepo, resolveLevel, monthsAgo, LEVEL_CONFIG } from './repoScoring.js';

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

const MANIFEST_FILES = {
    JavaScript: 'package.json',
    TypeScript: 'package.json',
    HTML: 'package.json',      // React repos often report as HTML
    CSS: 'package.json',       // Some React repos report as CSS
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

const TIER_1_LIMIT = 3;  //top 3 repos get dependencies AND 13k readme
const README_LIMIT = 13000; //13,000 character circuit breaker


export async function fetchAndFilterRepos(githubUrl, experienceLevel) {
    const usernameMatch = githubUrl.match(/github\.com\/([^/]+)/);
    if (!usernameMatch) throw new Error('Invalid GitHub URL provided.');
    const username = usernameMatch[1];

    const level = resolveLevel(experienceLevel);
    const { cutoffMonths } = LEVEL_CONFIG[level];

    try {
        const { data: repos } = await octokit.rest.repos.listForUser({
            username,
            per_page: 100,
            sort: 'updated',
        });

        const nonForks = repos.filter((r) => !r.fork);

        // Base data for everyone — carry extra fields needed by scorer & substance signals
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

        // drop tiny repos and repos outside the level's time window
        const now = Date.now();
        const candidates = baseRepos.filter(
            (r) => r.size > 10 && monthsAgo(r.pushed_at, now) < cutoffMonths
        );

        const poolForRanking = candidates.length > 0 ? candidates : baseRepos;
        const candidateNames = new Set(poolForRanking.map((r) => r.name));

        // Step 1 – Deep dive on ALL candidates in parallel (languages + manifest)
        // README is NOT fetched here; that happens after scoring (tier-1 only).
        await Promise.all(
            poolForRanking.map(async (baseData) => {
                // deep dive 1: fetch languages
                try {
                    const { data: languages } = await octokit.rest.repos.listLanguages({
                        owner: username,
                        repo: baseData.name,
                    });
                    baseData.languages = languages;
                } catch {
                    // ignore — sigStack will treat absent field as 0
                }

                // determine manifest path; fall back to package.json for unknown/null
                // languages since many React/JS projects report as HTML, CSS, or null.
                const manifestPath =
                    MANIFEST_FILES[baseData.language] ??
                    (baseData.language == null ? 'package.json' : null);

                // deep dive 2: scan manifests
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

                                // Strip pure tooling noise but keep frameworks & libraries
                                const noiseWords = ['@types/', 'eslint', 'prettier', 'husky', 'lint-staged', 'nodemon', 'ts-node', 'jest', 'vitest'];
                                const cleanDeps = allDeps
                                    .filter(dep => !noiseWords.some(noise => dep.includes(noise)))
                                    .slice(0, 20);

                                baseData.detectedFrameworks = cleanDeps;

                                // Explicit framework signal string for the AI
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
                    } catch {
                        // No manifest found or not parseable — skip silently
                    }
                }
            })
        );

        // Step 2 – Score every candidate AFTER deep dive (post-deep-dive fields
        // like languages/detectedFrameworks are now populated).
        // Tie-break by pushed_at descending so deterministic ordering.
        const scored = poolForRanking
            .map((repo) => ({ repo, score: scoreRepo(repo, level, now) }))
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                // tie-break: more recently pushed first
                return new Date(b.repo.pushed_at).getTime() - new Date(a.repo.pushed_at).getTime();
            });

        const tier1Names = new Set(scored.slice(0, TIER_1_LIMIT).map(({ repo }) => repo.name));

        // Step 3 – Fetch README for tier-1 repos only; mark isMajor = true.
        await Promise.all(
            scored.slice(0, TIER_1_LIMIT).map(async ({ repo: baseData }) => {
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
                } catch {
                    // no readme — skip silently
                }
            })
        );

        // Step 4 – Assemble final output: same shape as before.
        // Non-candidates are returned as plain baseData, as before.
        // score is an optional addition — safe because githubData is Mixed.
        return baseRepos.map((baseData) => {
            if (!candidateNames.has(baseData.name)) return baseData;
            // Attach the computed score for visibility / future use
            const entry = scored.find(({ repo }) => repo.name === baseData.name);
            if (entry) baseData.score = entry.score;
            return baseData;
        });

    } catch (error) {
        console.error('Error fetching from GitHub:', error.message);
        throw new Error('Failed to retrieve GitHub repository data.');
    }
}
