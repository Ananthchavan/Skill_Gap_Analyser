/**
 * repoScoring.js — pure, no I/O
 *
 * Exports:
 *   LEVEL_CONFIG   – all tunable numbers, keyed by experience level
 *   resolveLevel   – normalise / fall back to "junior"
 *   monthsAgo      – calendar distance helper (injectable `now`)
 *   scoreRepo      – 0-100 score for a single repo object
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * All scoring parameters live here and nowhere else.
 *
 * @type {Record<string, {
 *   halfLifeMonths: number,
 *   recencyFloor:   number,
 *   cutoffMonths:   number,
 *   w_recency:      number,
 *   w_impact:       number,
 *   w_substance:    number,
 * }>}
 */
export const LEVEL_CONFIG = {
    entry: {
        halfLifeMonths: 6,
        recencyFloor:   0,
        cutoffMonths:   24,
        w_recency:      0.45,
        w_impact:       0.15,
        w_substance:    0.40,
    },
    junior: {
        halfLifeMonths: 12,
        recencyFloor:   0.05,
        cutoffMonths:   36,
        w_recency:      0.35,
        w_impact:       0.20,
        w_substance:    0.45,
    },
    mid: {
        halfLifeMonths: 24,
        recencyFloor:   0.15,
        cutoffMonths:   60,
        w_recency:      0.25,
        w_impact:       0.30,
        w_substance:    0.45,
    },
    senior: {
        halfLifeMonths: 48,
        recencyFloor:   0.30,
        cutoffMonths:   120,
        w_recency:      0.10,
        w_impact:       0.40,
        w_substance:    0.50,
    },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

/**
 * Resolve an arbitrary level string to a known key, defaulting to "junior".
 *
 * @param {string|undefined|null} level
 * @returns {"entry"|"junior"|"mid"|"senior"}
 */
export function resolveLevel(level) {
    return Object.prototype.hasOwnProperty.call(LEVEL_CONFIG, level) ? level : 'junior';
}

/**
 * How many months ago was `dateStr`, relative to `now` (ms since epoch)?
 * Returns a large sentinel (9999) on invalid / missing dates so the recency
 * floor still applies and the function never throws.
 *
 * @param {string|undefined|null} dateStr  – ISO-8601 date string
 * @param {number}                now      – current time in ms (injectable for tests)
 * @returns {number}  non-negative months elapsed
 */
export function monthsAgo(dateStr, now) {
    if (!dateStr) return 9999;
    const ts = new Date(dateStr).getTime();
    if (Number.isNaN(ts)) return 9999;
    // clamp negative deltas (future dates) to 0
    return Math.max(0, (now - ts) / MS_PER_MONTH);
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Score a single repo object on a 0-100 scale.
 *
 * The repo is expected to carry the base fields always present after
 * fetchAndFilterRepos (stars, forks, size, pushed_at, created_at) plus the
 * optional deep-dive fields (languages, detectedFrameworks, isMajor,
 * has_pages, homepage, description, topics).  Missing optional fields are
 * treated as 0 / absent — never throws.
 *
 * @param {object} repo
 * @param {string} level   – raw level string (will be resolved internally)
 * @param {number} [now]   – ms since epoch; defaults to Date.now()
 * @returns {number}  0–100 (two decimal places)
 */
export function scoreRepo(repo, level, now = Date.now()) {
    const cfg = LEVEL_CONFIG[resolveLevel(level)];

    // ---- recency (0-1) -----------------------------------------------------
    const months = monthsAgo(repo.pushed_at, now);
    const decayed = Math.pow(0.5, months / cfg.halfLifeMonths);
    const recency = Math.max(cfg.recencyFloor, decayed);

    // ---- impact (0-1) -------------------------------------------------------
    const stars  = repo.stars  ?? 0;
    const forks  = repo.forks  ?? 0;
    // log1p(50) ≈ 3.932 — repos around 50 stars score ~1
    const impact = Math.min(1, (Math.log1p(stars) + 0.5 * Math.log1p(forks)) / Math.log1p(50));

    // ---- substance sub-signals (each 0-1) ----------------------------------

    // size (KB, log-scaled; weight 0.10)
    const sizeKB  = repo.size ?? 0;
    // log1p(5000) ≈ 8.517 → anything ≥5 MB scores ~1
    const sigSize = Math.min(1, Math.log1p(sizeKB) / Math.log1p(5000));

    // sustained span — months between first commit proxy (created_at) and
    // last push, capped at 24 months (weight 0.25)
    let sigSpan = 0;
    if (repo.created_at && repo.pushed_at) {
        const createdTs = new Date(repo.created_at).getTime();
        const pushedTs  = new Date(repo.pushed_at).getTime();
        if (!Number.isNaN(createdTs) && !Number.isNaN(pushedTs)) {
            const spanMonths = Math.max(0, (pushedTs - createdTs) / MS_PER_MONTH);
            sigSpan = Math.min(1, spanMonths / 24);
        }
    }

    // deployed — GitHub Pages or a non-empty homepage (weight 0.20)
    const sigDeployed = (repo.has_pages === true || (typeof repo.homepage === 'string' && repo.homepage.trim().length > 0))
        ? 1
        : 0;

    // documented — real description and/or topics (weight 0.10)
    const hasRealDesc = typeof repo.description === 'string'
        && repo.description.trim().length > 0
        && repo.description.trim() !== 'No description provided.';
    const hasTopics   = Array.isArray(repo.topics) && repo.topics.length > 0;
    const sigDocumented = (hasRealDesc || hasTopics) ? 1 : 0;

    // stack depth — languages count + detectedFrameworks / isMajor (weight 0.35)
    // Only counted when deep-dive fields are actually present.
    let sigStack = 0;
    const hasDeepDive = repo.languages !== undefined || repo.detectedFrameworks !== undefined;
    if (hasDeepDive) {
        const langCount   = typeof repo.languages === 'object' && repo.languages !== null
            ? Object.keys(repo.languages).length
            : 0;
        // detectedFrameworks may be an array or a string (non-JS manifests)
        const fwCount = Array.isArray(repo.detectedFrameworks)
            ? repo.detectedFrameworks.length
            : (typeof repo.detectedFrameworks === 'string' && repo.detectedFrameworks.length > 0 ? 1 : 0);
        const isMajorBonus = repo.isMajor ? 1 : 0;
        // langCount capped at 5, fwCount capped at 10; isMajor adds 1 bonus point
        const rawStack = (Math.min(langCount, 5) / 5) * 0.4
                       + (Math.min(fwCount,   10) / 10) * 0.4
                       + isMajorBonus * 0.2;
        sigStack = Math.min(1, rawStack);
    }

    // weighted substance (weights sum to 1.00)
    const substance =
          0.10 * sigSize
        + 0.25 * sigSpan
        + 0.20 * sigDeployed
        + 0.10 * sigDocumented
        + 0.35 * sigStack;

    // ---- final score -------------------------------------------------------
    const raw = cfg.w_recency    * recency
              + cfg.w_impact     * impact
              + cfg.w_substance  * substance;

    // clamp to [0, 1] before scaling — floating-point safety
    return Math.round(Math.min(1, Math.max(0, raw)) * 100 * 100) / 100;
}
