import { describe, expect, it } from 'vitest';
import { calculatePhotoStreakWeeks } from './streak';
import type { PhotoEntry } from '../../plants/models/plant.types';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const NOW = new Date('2026-01-15T12:00:00.000Z').getTime();

const photoAt = (createdAt: number): PhotoEntry => ({
  id: crypto.randomUUID(),
  createdAt,
  type: 'growth',
});

describe('calculatePhotoStreakWeeks', () => {
  it('is 0 with no photos', () => {
    expect(calculatePhotoStreakWeeks([], NOW)).toBe(0);
  });

  it('is 0 when the most recent photo is more than a week old', () => {
    const photos = [photoAt(NOW - 3 * WEEK_MS)];
    expect(calculatePhotoStreakWeeks(photos, NOW)).toBe(0);
  });

  it('counts a single photo in the current week as a streak of 1', () => {
    const photos = [photoAt(NOW)];
    expect(calculatePhotoStreakWeeks(photos, NOW)).toBe(1);
  });

  it('counts consecutive weeks with at least one photo each', () => {
    const photos = [photoAt(NOW), photoAt(NOW - WEEK_MS), photoAt(NOW - 2 * WEEK_MS)];
    expect(calculatePhotoStreakWeeks(photos, NOW)).toBe(3);
  });

  it('does not break the streak when the current week has no photo yet, but last week does', () => {
    const photos = [photoAt(NOW - WEEK_MS), photoAt(NOW - 2 * WEEK_MS)];
    expect(calculatePhotoStreakWeeks(photos, NOW)).toBe(2);
  });

  it('stops counting at the first gap week', () => {
    const photos = [photoAt(NOW), photoAt(NOW - 3 * WEEK_MS)]; // gap at NOW-1week/NOW-2weeks
    expect(calculatePhotoStreakWeeks(photos, NOW)).toBe(1);
  });

  it('multiple photos in the same week only count once', () => {
    const photos = [photoAt(NOW), photoAt(NOW - DAY_MS), photoAt(NOW - 2 * DAY_MS)];
    expect(calculatePhotoStreakWeeks(photos, NOW)).toBe(1);
  });
});
