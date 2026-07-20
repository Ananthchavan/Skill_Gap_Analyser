import { Octokit } from 'octokit';

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

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

function monthsAgo(dateStr) {
    return (Date.now() - new Date(dateStr).getTime()) / MS_PER_MONTH;
}

function scoreRepo(repo) {
    const recencyBonus =
        monthsAgo(repo.pushed_at) < 12 ? 4 : monthsAgo(repo.pushed_at) < 24 ? 2 : 0;
    const sizeBonus = repo.size > 5000 ? 3 : repo.size > 500 ? 1 : 0;

    return repo.stars * 2 + repo.forks * 3 + sizeBonus + recencyBonus;
}

export async function fetchAndFilterRepos(githubUrl) {
    const usernameMatch = githubUrl.match(/github\.com\/([^/]+)/);
    if (!usernameMatch) throw new Error('Invalid GitHub URL provided.');
    const username = usernameMatch[1];

    try {
        const { data: repos } = await octokit.rest.repos.listForUser({
            username,
            per_page: 100,
            sort: 'updated',
        });

        const nonForks = repos.filter((r) => !r.fork);

        // Base data for everyone
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
        }));

        //pre-filter drop dead repos 
        const candidates = baseRepos.filter(
            (r) => r.size > 10 && monthsAgo(r.pushed_at) < 36
        );

        const poolForRanking = candidates.length > 0 ? candidates : baseRepos;

        //rank all valid repos descending order by score
        const ranked = [...poolForRanking]
            .sort((a, b) => scoreRepo(b) - scoreRepo(a));

        //create fast-lookup sets for our tier system and valid candidates
        const tier1Names = new Set(ranked.slice(0, TIER_1_LIMIT).map((r) => r.name));
        const candidateNames = new Set(poolForRanking.map((r) => r.name));

        const processedRepos = await Promise.all(
            baseRepos.map(async (baseData) => {
                const isTier1 = tier1Names.has(baseData.name);
                const isCandidate = candidateNames.has(baseData.name);

                if (!isCandidate) return baseData;

                //deep dive 1: fetch languages
                try {
                    const { data: languages } = await octokit.rest.repos.listLanguages({
                        owner: username,
                        repo: baseData.name,
                    });
                    baseData.languages = languages;
                } catch {
                    //ignore
                }

                //determine manifest path fall back to package.json for unknown/null
                //languages since many React/JS projects report as HTML, CSS, or null.
                const manifestPath =
                    MANIFEST_FILES[baseData.language] ??
                    (baseData.language == null ? 'package.json' : null);

                //deep dive 2: scan manifests
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
                                    ...(parsed.devDependencies || {})
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

                //deep dive 3: README
                if (isTier1) {
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
                        //no readme skip
                    }
                }

                return baseData;
            })
        );

        return processedRepos;
    } catch (error) {
        console.error('Error fetching from GitHub:', error.message);
        throw new Error('Failed to retrieve GitHub repository data.');
    }
}