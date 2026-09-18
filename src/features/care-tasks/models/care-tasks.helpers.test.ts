import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDefaultTasks,
  formatDue,
  getCareStatus,
  getNextDue,
  shouldApplyPhotoBackoff,
} from './care-tasks.helpers';
import type { CareTask } from './care-tasks.model';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-01-15T12:00:00.000Z').getTime();

const baseTask = (overrides: Partial<CareTask> = {}): CareTask => ({
  id: 't1',
  plantId: 'p1',
  type: 'watering',
  intervalDays: 7,
  lastDoneAt: null,
  ...overrides,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getNextDue', () => {
  it('is due right now for a task that was never done', () => {
    expect(getNextDue(baseTask({ lastDoneAt: null }))).toBe(NOW);
  });

  it('adds intervalDays to lastDoneAt', () => {
    const lastDoneAt = NOW - 3 * DAY_MS;
    expect(getNextDue(baseTask({ lastDoneAt, intervalDays: 7 }))).toBe(lastDoneAt + 7 * DAY_MS);
  });
});

describe('getCareStatus', () => {
  it('is overdue when never done', () => {
    expect(getCareStatus(baseTask({ lastDoneAt: null }))).toBe('overdue');
  });

  it('is overdue once the next due date is in the past', () => {
    const task = baseTask({ lastDoneAt: NOW - 10 * DAY_MS, intervalDays: 7 });
    expect(getCareStatus(task)).toBe('overdue');
  });

  it('is soon when due within 2 days', () => {
    const task = baseTask({ lastDoneAt: NOW - 6 * DAY_MS, intervalDays: 7 }); // due in 1 day
    expect(getCareStatus(task)).toBe('soon');
  });

  it('is ok when due further than 2 days away', () => {
    const task = baseTask({ lastDoneAt: NOW - 1 * DAY_MS, intervalDays: 7 }); // due in 6 days
    expect(getCareStatus(task)).toBe('ok');
  });
});

describe('createDefaultTasks', () => {
  it('creates watering/feeding/misting tasks for the plant', async () => {
    const added: CareTask[] = [];

    await createDefaultTasks('p1', async (task) => {
      added.push(task);
    });

    expect(added.map((task) => task.type)).toEqual(['watering', 'feeding', 'misting']);
    expect(added.every((task) => task.plantId === 'p1' && task.lastDoneAt === null)).toBe(true);
  });
});

describe('shouldApplyPhotoBackoff', () => {
  it('ignores non-photo tasks', () => {
    const task = baseTask({ type: 'watering', intervalDays: 7, lastDoneAt: NOW - 100 * DAY_MS });
    expect(shouldApplyPhotoBackoff(task, NOW)).toBe(false);
  });

  it('ignores tasks that were never done', () => {
    const task = baseTask({ type: 'photo', intervalDays: 7, lastDoneAt: null });
    expect(shouldApplyPhotoBackoff(task, NOW)).toBe(false);
  });

  it('ignores tasks already at or above the backoff interval', () => {
    const task = baseTask({ type: 'photo', intervalDays: 14, lastDoneAt: NOW - 100 * DAY_MS });
    expect(shouldApplyPhotoBackoff(task, NOW)).toBe(false);
  });

  it('backs off after 2 full missed cycles', () => {
    const task = baseTask({ type: 'photo', intervalDays: 7, lastDoneAt: NOW - 21 * DAY_MS });
    expect(shouldApplyPhotoBackoff(task, NOW)).toBe(true);
  });

  it('does not back off before 2 full missed cycles', () => {
    const task = baseTask({ type: 'photo', intervalDays: 7, lastDoneAt: NOW - 14 * DAY_MS });
    expect(shouldApplyPhotoBackoff(task, NOW)).toBe(false);
  });
});

describe('formatDue', () => {
  it('formats overdue dates', () => {
    expect(formatDue(NOW - 3 * DAY_MS)).toBe('Просрочено на 3 дня');
  });

  it('formats today', () => {
    expect(formatDue(NOW)).toBe('Сегодня');
  });

  it('formats tomorrow', () => {
    expect(formatDue(NOW + DAY_MS)).toBe('Завтра');
  });

  it('formats future dates', () => {
    expect(formatDue(NOW + 5 * DAY_MS)).toBe('Через 5 дней');
  });
});
