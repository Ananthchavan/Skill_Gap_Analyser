import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

const MANIFEST_FILES = {
    JavaScript: 'package.json',
    TypeScript: 'package.json',
    Python: 'requirements.txt',
    Go: 'go.mod',
    Ruby: 'Gemfile',
    Java: 'pom.xml',
};

const TIER_1_LIMIT = 3;  //top 3 repos get dependencies and 13k readme
const TIER_2_LIMIT = 7;  //top 4-7 repos get dependencies (no readme)
const README_LIMIT = 13000; //13,000 character circuit breaker

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

function monthsAgo(dateStr) {
    return (Date.now() - new Date(dateStr).getTime()) / MS_PER_MONTH;
}

function scoreRepo(repo) {
    const recencyBonus =
        monthsAgo(repo.pushed_at) < 12 ? 4 : monthsAgo(repo.pushed_at) < 24 ? 2 : 0;
    const sizeBonus = repo.size > 5000 ? 3 : repo.size > 500 ? 1 : 0; // Adjusted size thresholds to be realistic

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

        //base data for everyone
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

        // rank all valid repos descending order by score
        const ranked = [...poolForRanking]
            .sort((a, b) => scoreRepo(b) - scoreRepo(a));

        // create fast-lookup sets for our tier system
        const tier1Names = new Set(ranked.slice(0, TIER_1_LIMIT).map((r) => r.name));
        const tier2Names = new Set(ranked.slice(TIER_1_LIMIT, TIER_2_LIMIT).map((r) => r.name));

        const processedRepos = await Promise.all(
            baseRepos.map(async (baseData) => {
                const isTier1 = tier1Names.has(baseData.name);
                const isTier2 = tier2Names.has(baseData.name);

                // if not tier1 or tier2, its tier3(No deep dive).
                if (!isTier1 && !isTier2) return baseData;

                baseData.isMajor = true;

                // tier1 and tier2 data(Languages & Dependencies)
                try {
                    const { data: languages } = await octokit.rest.repos.listLanguages({
                        owner: username,
                        repo: baseData.name,
                    });
                    baseData.languages = languages;
                } catch {
                    //ignore
                }

                const manifestPath = MANIFEST_FILES[baseData.language];
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

                                //strip out unnecessary dependecies
                                const noiseWords = ['@types', 'eslint', 'prettier', 'husky', 'lint', 'babel', 'nodemon', 'ts-node', 'jest', 'vitest'];

                                baseData.detectedFrameworks = allDeps
                                    .filter(dep => !noiseWords.some(noise => dep.includes(noise)))
                                    .slice(0, 15); //to save LLM tokens

                            } else {
                                //for python/java
                                baseData.detectedFrameworks = decoded.substring(0, 300);
                            }
                        }
                    } catch {
                        //skip
                    }
                }

                // tier1 exclusive Data (The full readme)
                if (isTier1) {
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
                        // no readme skip
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