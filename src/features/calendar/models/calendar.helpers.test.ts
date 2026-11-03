import { describe, expect, it } from 'vitest';
import { buildMonthGrid, getTaskOccurrencesInRange, startOfDay } from './calendar.helpers';
import type { CareTask } from '../../care-tasks';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('buildMonthGrid', () => {
  it('returns full weeks covering the whole month, Monday-first', () => {
    // Сентябрь 2026 начинается во вторник — значит первая неделя должна начинаться с понедельника 31 августа.
    const weeks = buildMonthGrid(2026, 8); // month index 8 = сентябрь

    for (const week of weeks) {
      expect(week).toHaveLength(7);
    }

    const firstDay = new Date(weeks[0][0]);
    expect(firstDay.getDay()).toBe(1); // Monday

    const lastWeek = weeks[weeks.length - 1];
    const lastDay = new Date(lastWeek[6]);
    expect(lastDay.getDay()).toBe(0); // Sunday

    // 1 сентября 2026 обязательно должно попасть в сетку.
    const sept1 = new Date(2026, 8, 1).getTime();
    expect(weeks.flat()).toContain(sept1);
  });

  it('handles February correctly regardless of leap year (no 31 Feb overflow)', () => {
    const weeks2026 = buildMonthGrid(2026, 1); // non-leap
    const allDays = weeks2026.flat();
    const febDays = allDays.filter((d) => new Date(d).getMonth() === 1);
    expect(febDays).toHaveLength(28);

    const weeks2028 = buildMonthGrid(2028, 1); // leap
    const febDays2028 = weeks2028.flat().filter((d) => new Date(d).getMonth() === 1);
    expect(febDays2028).toHaveLength(29);
  });

  it('produces 5 or 6 full weeks depending on the month', () => {
    const weeks = buildMonthGrid(2026, 8);
    expect(weeks.length === 5 || weeks.length === 6).toBe(true);
  });
});

const baseTask = (overrides: Partial<CareTask> = {}): CareTask => ({
  id: 't1',
  plantId: 'p1',
  type: 'watering',
  intervalDays: 7,
  lastDoneAt: null,
  ...overrides,
});

describe('getTaskOccurrencesInRange', () => {
  const now = new Date(2026, 8, 15).getTime(); // 15 сентября 2026
  const rangeStart = new Date(2026, 8, 1).getTime();
  const rangeEnd = new Date(2026, 8, 30).getTime();

  it('never-done task: first occurrence is today, then every interval, all planned', () => {
    const task = baseTask({ lastDoneAt: null, intervalDays: 7 });
    const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);

    expect(occurrences[0]).toEqual({ date: startOfDay(now), status: 'planned' });
    expect(occurrences.every((o) => o.status === 'planned')).toBe(true);
  });

  it('marks the exact lastDoneAt day as done', () => {
    const lastDoneAt = new Date(2026, 8, 10).getTime();
    const task = baseTask({ lastDoneAt, intervalDays: 7 });
    const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);

    expect(occurrences[0]).toEqual({ date: startOfDay(lastDoneAt), status: 'done' });
  });

  it('marks a past-due projected occurrence as missed, future ones as planned', () => {
    // Полито 10 сентября, интервал 3 дня -> следующие точки: 13 (в прошлом от "now"=15) и 16 (в будущем).
    const lastDoneAt = new Date(2026, 8, 10).getTime();
    const task = baseTask({ lastDoneAt, intervalDays: 3 });
    const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);

    const missed = occurrences.find((o) => o.date === new Date(2026, 8, 13).getTime());
    const planned = occurrences.find((o) => o.date === new Date(2026, 8, 16).getTime());

    expect(missed?.status).toBe('missed');
    expect(planned?.status).toBe('planned');
  });

  it('recomputes forward from a later lastDoneAt after a skip is confirmed done', () => {
    // Пользователь пропустил несколько поливов и отметил выполнение только 14 сентября.
    const task = baseTask({ lastDoneAt: new Date(2026, 8, 14).getTime(), intervalDays: 3 });
    const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);

    // Следующая точка после 14-го при интервале 3 дня — 17-е, и это единственная будущая точка рядом с "now".
    const next = occurrences.find((o) => o.date === new Date(2026, 8, 17).getTime());
    expect(next?.status).toBe('planned');
    // Никаких точек между исходным (гипотетическим) 7-м и 14-м не проецируется — история не выдумывается.
    expect(occurrences.some((o) => o.date < startOfDay(new Date(2026, 8, 14).getTime()))).toBe(false);
  });

  it('returns nothing outside the requested range', () => {
    const task = baseTask({ lastDoneAt: new Date(2026, 0, 1).getTime(), intervalDays: 7 });
    const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);
    expect(occurrences.every((o) => o.date >= rangeStart && o.date <= rangeEnd)).toBe(true);
  });

  it('respects day granularity (DAY_MS-based sanity check)', () => {
    const task = baseTask({ lastDoneAt: now - 2 * DAY_MS, intervalDays: 1 });
    const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);
    expect(occurrences.length).toBeGreaterThan(0);
  });
});
