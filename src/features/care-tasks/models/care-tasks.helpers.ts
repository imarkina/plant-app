import type { CareStatus, CareTask } from './care-tasks.model';

const daysToMs = (days: number) => {
  return days * 24 * 60 * 60 * 1000;
};

export const getNextDue = (task: CareTask): number => {
  if (task.lastDoneAt === null) {
    return Date.now();
  }

  return task.lastDoneAt + daysToMs(task.intervalDays);
};

const TWO_DAYS_LEFT_BEFORE_TASK = 2;

export const getCareStatus = (task: CareTask): CareStatus => {
  const nextDue = getNextDue(task);
  const now = Date.now();
  if (nextDue < now) {
    return 'overdue';
  }
  if (nextDue - now < daysToMs(TWO_DAYS_LEFT_BEFORE_TASK)) {
    return 'soon';
  }

  return 'ok';
};
