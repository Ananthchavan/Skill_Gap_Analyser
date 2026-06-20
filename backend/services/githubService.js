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

        const ranked = [...poolForRanking]
            .sort((a, b) => scoreRepo(b) - scoreRepo(a))
            .slice(0, MAX_DEEP_DIVES);

        const deepDiveNames = new Set(ranked.map((r) => r.name));

        const processedRepos = await Promise.all(
            baseRepos.map(async (baseData) => {
                if (!deepDiveNames.has(baseData.name)) return baseData;

                baseData.isMajor = true;

                // languages breakdown
                try {
                    const { data: languages } = await octokit.rest.repos.listLanguages({
                        owner: username,
                        repo: baseData.name,
                    });
                    baseData.languages = languages;
                } catch {
                    //ignore
                }

                //Storing dependency based on language
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
                                baseData.dependencies = {
                                    ...parsed.dependencies,
                                    ...parsed.devDependencies,
                                };
                            } else {
                                baseData.dependenciesRaw = decoded.substring(0, 1000);
                            }
                        }
                    } catch {
                        //skip
                    }
                }

                // readme
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

                return baseData;
            })
        );

        return processedRepos;
    } catch (error) {
        console.error('Error fetching from GitHub:', error.message);
        throw new Error('Failed to retrieve GitHub repository data.');
    }
}