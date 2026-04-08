import { describe, it, expect } from 'vitest';
import {
  interpolate,
  calculateTimeForDistance,
  calculateTargetTime,
  roundToWholeSeconds,
  findClosestLevel,
  prValuesToSortedPRs,
  SPRINT_EXPONENT,
  EXPERIENCE_LEVEL_PRS,
  type SortedPR,
  type PRValues,
  type ExperienceLevel,
} from '../sprint-calculator';

// ── interpolate ──

describe('interpolate', () => {
  it('returns the midpoint between two points', () => {
    expect(interpolate(5, 0, 0, 10, 20)).toBe(10);
  });

  it('returns y1 when x equals x1', () => {
    expect(interpolate(0, 0, 0, 10, 20)).toBe(0);
  });

  it('returns y2 when x equals x2', () => {
    expect(interpolate(10, 0, 0, 10, 20)).toBe(20);
  });

  it('interpolates at 25% between two points', () => {
    expect(interpolate(2.5, 0, 10, 10, 30)).toBe(15);
  });
});

// ── calculateTimeForDistance ──

describe('calculateTimeForDistance', () => {
  it('interpolates linearly between two known PRs', () => {
    const prs: SortedPR[] = [
      { distance: 100, time: 12.0 },
      { distance: 200, time: 25.0 },
    ];
    // 150m is exactly halfway → expected = 12 + (150-100)*(25-12)/(200-100) = 18.5
    expect(calculateTimeForDistance(150, prs)).toBeCloseTo(18.5, 5);
  });

  it('extrapolates using power law for distances shorter than shortest PR', () => {
    const prs: SortedPR[] = [
      { distance: 100, time: 12.0 },
      { distance: 200, time: 25.0 },
    ];
    const expected = 12.0 * Math.pow(60 / 100, SPRINT_EXPONENT);
    expect(calculateTimeForDistance(60, prs)).toBeCloseTo(expected, 5);
  });

  it('extrapolates using power law for distances longer than longest PR', () => {
    const prs: SortedPR[] = [
      { distance: 100, time: 12.0 },
      { distance: 200, time: 25.0 },
    ];
    const expected = 25.0 * Math.pow(400 / 200, SPRINT_EXPONENT);
    expect(calculateTimeForDistance(400, prs)).toBeCloseTo(expected, 5);
  });

  it('returns exact PR value when target matches a known distance', () => {
    const prs: SortedPR[] = [
      { distance: 100, time: 12.0 },
      { distance: 200, time: 25.0 },
    ];
    expect(calculateTimeForDistance(100, prs)).toBe(12.0);
    expect(calculateTimeForDistance(200, prs)).toBe(25.0);
  });

  // 60m bugfix tests
  it('returns exact 60m PR when 60m is in the data', () => {
    const prs: SortedPR[] = [
      { distance: 60, time: 7.5 },
      { distance: 100, time: 12.0 },
      { distance: 200, time: 25.0 },
    ];
    expect(calculateTimeForDistance(60, prs)).toBe(7.5);
  });

  it('uses 60m PR for interpolation between 60m and 100m', () => {
    const prs: SortedPR[] = [
      { distance: 60, time: 7.5 },
      { distance: 100, time: 12.0 },
    ];
    // 80m is halfway between 60 and 100 → 7.5 + (80-60)*(12-7.5)/(100-60) = 7.5 + 2.25 = 9.75
    expect(calculateTimeForDistance(80, prs)).toBeCloseTo(9.75, 5);
  });

  it('extrapolates from 60m PR for distances shorter than 60m', () => {
    const prs: SortedPR[] = [
      { distance: 60, time: 7.5 },
      { distance: 100, time: 12.0 },
    ];
    const expected = 7.5 * Math.pow(40 / 60, SPRINT_EXPONENT);
    expect(calculateTimeForDistance(40, prs)).toBeCloseTo(expected, 5);
  });

  // Single PR
  it('extrapolates from a single PR using power law', () => {
    const prs: SortedPR[] = [{ distance: 100, time: 12.0 }];
    const expected200 = 12.0 * Math.pow(200 / 100, SPRINT_EXPONENT);
    const expected60 = 12.0 * Math.pow(60 / 100, SPRINT_EXPONENT);
    expect(calculateTimeForDistance(200, prs)).toBeCloseTo(expected200, 5);
    expect(calculateTimeForDistance(60, prs)).toBeCloseTo(expected60, 5);
  });

  it('throws when no PRs are provided', () => {
    expect(() => calculateTimeForDistance(100, [])).toThrow('Minstens één PR is vereist');
  });
});

// ── calculateTargetTime ──

describe('calculateTargetTime', () => {
  const prs: SortedPR[] = [
    { distance: 100, time: 12.0 },
    { distance: 200, time: 25.0 },
  ];

  it('at 100% returns the base time', () => {
    expect(calculateTargetTime(100, 100, prs)).toBe(12.0);
  });

  it('at 50% returns double the base time', () => {
    expect(calculateTargetTime(100, 50, prs)).toBe(24.0);
  });

  it('at 80% returns base time / 0.8', () => {
    expect(calculateTargetTime(200, 80, prs)).toBeCloseTo(25.0 / 0.8, 5);
  });
});

// ── roundToWholeSeconds ──

describe('roundToWholeSeconds', () => {
  it('rounds 10.4 down to 10', () => {
    expect(roundToWholeSeconds(10.4)).toBe(10);
  });

  it('rounds 10.5 up to 11', () => {
    expect(roundToWholeSeconds(10.5)).toBe(11);
  });

  it('rounds 10.6 up to 11', () => {
    expect(roundToWholeSeconds(10.6)).toBe(11);
  });

  it('keeps whole numbers unchanged', () => {
    expect(roundToWholeSeconds(15)).toBe(15);
  });
});

// ── findClosestLevel ──

describe('findClosestLevel', () => {
  it('returns null when no PRs are provided', () => {
    expect(findClosestLevel({})).toBeNull();
  });

  it('returns the exact level when PRs match exactly', () => {
    const levels: ExperienceLevel[] = ['beginner', 'novice', 'intermediate', 'gevorderd', 'elite'];
    for (const level of levels) {
      const prValues: PRValues = { ...EXPERIENCE_LEVEL_PRS[level] };
      expect(findClosestLevel(prValues)).toBe(level);
    }
  });

  it('returns the closest level for values between two levels', () => {
    // Values slightly closer to intermediate than novice
    const prValues: PRValues = { 100: 12.6, 200: 27.2 };
    expect(findClosestLevel(prValues)).toBe('intermediate');
  });

  it('works with a single PR value', () => {
    // 60m = 9.5 matches beginner exactly
    const prValues: PRValues = { 60: 9.5 };
    expect(findClosestLevel(prValues)).toBe('beginner');
  });
});

// ── prValuesToSortedPRs ──

describe('prValuesToSortedPRs', () => {
  it('converts PRValues to sorted SortedPR array', () => {
    const prValues: PRValues = { 200: 25.0, 60: 7.5, 100: 12.0 };
    const result = prValuesToSortedPRs(prValues);
    expect(result).toEqual([
      { distance: 60, time: 7.5 },
      { distance: 100, time: 12.0 },
      { distance: 200, time: 25.0 },
    ]);
  });

  it('filters out undefined values', () => {
    const prValues: PRValues = { 100: 12.0 };
    const result = prValuesToSortedPRs(prValues);
    expect(result).toEqual([{ distance: 100, time: 12.0 }]);
  });

  it('returns empty array for empty input', () => {
    expect(prValuesToSortedPRs({})).toEqual([]);
  });
});
