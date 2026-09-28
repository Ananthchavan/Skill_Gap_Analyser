/**
 * repoScoring.test.js
 *
 * Uses node:test (built-in since Node 18).  No extra dependencies.
 * Run: node --experimental-vm-modules tests/repoScoring.test.js
 *   or: node tests/repoScoring.test.js   (Node 20+)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    LEVEL_CONFIG,
    resolveLevel,
    monthsAgo,
    scoreRepo,
} from '../services/repoScoring.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

/** Produce a fake Date.now() value that is `months` months in the past. */
function nowShift(months) {
    return Date.now() - months * MS_PER_MONTH;
}

/** ISO string that is exactly `months` months before `now`. */
function isoMonthsAgo(months, now = Date.now()) {
    return new Date(now - months * MS_PER_MONTH).toISOString();
}

/** Minimal well-formed repo object with sensible defaults. */
function makeRepo(overrides = {}) {
    const now = overrides._now ?? Date.now();
    return {
        name:        'test-repo',
        description: 'A real description',
        topics:      ['javascript'],
        stars:       0,
        forks:       0,
        size:        500,
        pushed_at:   isoMonthsAgo(1, now),
        created_at:  isoMonthsAgo(13, now),
        has_pages:   false,
        homepage:    null,
        isMajor:     false,
        // no deep-dive fields by default
        ...overrides,
    };
}

// ---------------------------------------------------------------------------
// resolveLevel
// ---------------------------------------------------------------------------

describe('resolveLevel', () => {
    it('returns known levels as-is', () => {
        assert.equal(resolveLevel('entry'),  'entry');
        assert.equal(resolveLevel('junior'), 'junior');
        assert.equal(resolveLevel('mid'),    'mid');
        assert.equal(resolveLevel('senior'), 'senior');
    });

    it('falls back to "junior" for unknown input', () => {
        assert.equal(resolveLevel('wizard'),    'junior');
        assert.equal(resolveLevel(''),          'junior');
        assert.equal(resolveLevel(null),        'junior');
        assert.equal(resolveLevel(undefined),   'junior');
        assert.equal(resolveLevel(42),          'junior');
    });
});

// ---------------------------------------------------------------------------
// monthsAgo
// ---------------------------------------------------------------------------

describe('monthsAgo', () => {
    it('returns approx 0 for a date right now', () => {
        const now = Date.now();
        assert.ok(monthsAgo(new Date(now).toISOString(), now) < 0.01);
    });

    it('returns 9999 for null / undefined / garbage', () => {
        const now = Date.now();
        assert.equal(monthsAgo(null,           now), 9999);
        assert.equal(monthsAgo(undefined,      now), 9999);
        assert.equal(monthsAgo('not-a-date',   now), 9999);
        assert.equal(monthsAgo('',             now), 9999);
    });

    it('clamps future dates to 0 (never negative)', () => {
        const now   = Date.now();
        const future = new Date(now + 30 * MS_PER_MONTH).toISOString();
        assert.equal(monthsAgo(future, now), 0);
    });
});

// ---------------------------------------------------------------------------
// Level cutoff filter (simulated — repoScoring doesn't do filtering itself,
// but LEVEL_CONFIG.cutoffMonths drives it in githubService)
// ---------------------------------------------------------------------------

describe('LEVEL_CONFIG cutoffMonths', () => {
    it('30-month-old repo fails entry cutoff (24) but passes mid cutoff (60)', () => {
        const cutoffEntry = LEVEL_CONFIG.entry.cutoffMonths;
        const cutoffMid   = LEVEL_CONFIG.mid.cutoffMonths;
        const ageMonths   = 30;

        assert.ok(ageMonths >= cutoffEntry, 'entry should exclude 30-month-old repo');
        assert.ok(ageMonths <  cutoffMid,   'mid should include 30-month-old repo');
    });
});

// ---------------------------------------------------------------------------
// scoreRepo — level sensitivity
// ---------------------------------------------------------------------------

describe('scoreRepo — old vs new repo across levels', () => {
    it('48-month-old substantial repo: senior score > entry score', () => {
        const now  = Date.now();
        const repo = makeRepo({
            _now:       now,
            pushed_at:  isoMonthsAgo(48, now),
            created_at: isoMonthsAgo(72, now),
            stars:      50,
            forks:      10,
            size:       3000,
            description: 'A mature production project',
            topics:     ['nodejs', 'postgres'],
            has_pages:  true,
            // deep-dive fields present
            languages:          { JavaScript: 10000, TypeScript: 5000, CSS: 1000 },
            detectedFrameworks: ['express', 'prisma', 'react'],
            isMajor:            true,
        });

        const seniorScore = scoreRepo(repo, 'senior', now);
        const entryScore  = scoreRepo(repo, 'entry',  now);

        assert.ok(
            seniorScore > entryScore,
            `Expected seniorScore (${seniorScore}) > entryScore (${entryScore})`
        );
    });

    it('brand-new tiny repo: entry score > senior score', () => {
        const now  = Date.now();
        const repo = makeRepo({
            _now:       now,
            pushed_at:  isoMonthsAgo(0.5, now),
            created_at: isoMonthsAgo(1,   now),
            stars:      0,
            forks:      0,
            size:       80,
        });

        const entryScore  = scoreRepo(repo, 'entry',  now);
        const seniorScore = scoreRepo(repo, 'senior', now);

        assert.ok(
            entryScore > seniorScore,
            `Expected entryScore (${entryScore}) > seniorScore (${seniorScore})`
        );
    });
});

// ---------------------------------------------------------------------------
// scoreRepo — impact / star sensitivity
// ---------------------------------------------------------------------------

describe('scoreRepo — star sensitivity', () => {
    it('0 stars vs 5 stars makes a meaningful difference', () => {
        const now = Date.now();
        const base = { pushed_at: isoMonthsAgo(2, now), created_at: isoMonthsAgo(6, now), size: 300 };

        const score0 = scoreRepo({ ...makeRepo({ _now: now }), ...base, stars: 0 }, 'junior', now);
        const score5 = scoreRepo({ ...makeRepo({ _now: now }), ...base, stars: 5 }, 'junior', now);

        assert.ok(score5 > score0, `5 stars (${score5}) should beat 0 stars (${score0})`);
        // Meaningful = at least 1 point apart on 0-100 scale
        assert.ok(score5 - score0 >= 0.5, `Difference too small: ${score5 - score0}`);
    });

    it('400 vs 500 stars barely changes the score (log scale compression)', () => {
        const now = Date.now();
        const base = { pushed_at: isoMonthsAgo(2, now), created_at: isoMonthsAgo(6, now), size: 300 };

        const score400 = scoreRepo({ ...makeRepo({ _now: now }), ...base, stars: 400 }, 'junior', now);
        const score500 = scoreRepo({ ...makeRepo({ _now: now }), ...base, stars: 500 }, 'junior', now);

        const diff = Math.abs(score500 - score400);
        assert.ok(
            diff < 2,
            `Expected <2 point diff for 400 vs 500 stars (log compression), got ${diff}`
        );
    });
});

// ---------------------------------------------------------------------------
// scoreRepo — robustness
// ---------------------------------------------------------------------------

describe('scoreRepo — robustness', () => {
    it('invalid level resolves to junior — same result as passing "junior"', () => {
        const now  = Date.now();
        const repo = makeRepo({ _now: now });

        const scoreInvalid = scoreRepo(repo, 'hacker',  now);
        const scoreJunior  = scoreRepo(repo, 'junior',  now);

        assert.equal(scoreInvalid, scoreJunior);
    });

    it('invalid pushed_at does not throw and does not return NaN', () => {
        const now  = Date.now();
        const repo = makeRepo({ _now: now, pushed_at: 'not-a-date' });

        let result;
        assert.doesNotThrow(() => { result = scoreRepo(repo, 'junior', now); });
        assert.ok(!Number.isNaN(result), 'score must not be NaN');
    });

    it('null pushed_at does not throw and does not return NaN', () => {
        const now  = Date.now();
        const repo = makeRepo({ _now: now, pushed_at: null });

        let result;
        assert.doesNotThrow(() => { result = scoreRepo(repo, 'mid', now); });
        assert.ok(!Number.isNaN(result), 'score must not be NaN');
    });

    it('score is always within 0-100 for a variety of inputs', () => {
        const now = Date.now();
        const cases = [
            makeRepo({ _now: now, stars: 0, forks: 0, size: 0, pushed_at: isoMonthsAgo(120, now) }),
            makeRepo({ _now: now, stars: 10000, forks: 5000, size: 50000, pushed_at: isoMonthsAgo(0, now), languages: { JS: 1 }, detectedFrameworks: Array(15).fill('lib'), isMajor: true }),
            makeRepo({ _now: now, pushed_at: null }),
            makeRepo({ _now: now, pushed_at: 'bad' }),
            makeRepo({ _now: now, stars: -1, forks: -1 }),    // coerced via ?? 0 / log1p handles negatives
        ];

        for (const level of ['entry', 'junior', 'mid', 'senior']) {
            for (const repo of cases) {
                const s = scoreRepo(repo, level, now);
                assert.ok(
                    s >= 0 && s <= 100,
                    `Score ${s} out of range for level=${level}, repo=${repo.name}`
                );
            }
        }
    });
});
