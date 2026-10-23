import type { PhotoEntry } from '../../plants/models/plant.types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function startOfWeek(ts: number): number {
  const date = new Date(ts);
  const dayIndex = (date.getDay() + 6) % 7; // 0 = Monday
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - dayIndex);
  return date.getTime();
}

/**
 * Consecutive weeks (Mon-Sun) with at least one photo across the whole collection.
 * The current, still-unfinished week doesn't break the streak on its own.
 */
export function calculatePhotoStreakWeeks(photos: PhotoEntry[], now: number): number {
  if (photos.length === 0) {
    return 0;
  }

  const weeksWithPhoto = new Set(photos.map((photo) => startOfWeek(photo.createdAt)));
  let cursor = startOfWeek(now);

  if (!weeksWithPhoto.has(cursor)) {
    cursor -= WEEK_MS;
    if (!weeksWithPhoto.has(cursor)) {
      return 0;
    }
  }

  let streak = 0;
  while (weeksWithPhoto.has(cursor)) {
    streak += 1;
    cursor -= WEEK_MS;
  }

  return streak;
}
