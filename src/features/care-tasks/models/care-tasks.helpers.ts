import type { CareStatus, CareTask, CareTaskType } from './care-tasks.model';
import type { PlantReport } from '../../plants/models/plant-report.types';
import { pluralDays } from '../../../shared/helpers';

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
  if (task.lastDoneAt === null) {
    return 'overdue';
  }

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

const DEFAULT_TASKS: Array<{ type: CareTaskType; intervalDays: number }> = [
  { type: 'watering', intervalDays: 5 },
  { type: 'feeding', intervalDays: 21 },
  { type: 'misting', intervalDays: 3 },
];

/**
 * Интервалы из паспорта ухода, который вернул Gemini, вместо захардкоженных
 * умолчаний. Числовые поля появились не сразу — у диагнозов, сохранённых до
 * этого, их нет, поэтому тип watering/fertilizing пропускается, если для
 * него нет числа (а не подставляется дефолт молча).
 */
export function deriveTasksFromCarePassport(
  carePassport: PlantReport['carePassport'],
): Array<{ type: CareTaskType; intervalDays: number }> {
  const tasks: Array<{ type: CareTaskType; intervalDays: number }> = [];

  if (typeof carePassport.watering.intervalDays === 'number') {
    tasks.push({ type: 'watering', intervalDays: carePassport.watering.intervalDays });
  }
  if (typeof carePassport.fertilizing.intervalDays === 'number') {
    tasks.push({ type: 'feeding', intervalDays: carePassport.fertilizing.intervalDays });
  }
  if (typeof carePassport.environment.mistingIntervalDays === 'number') {
    tasks.push({ type: 'misting', intervalDays: carePassport.environment.mistingIntervalDays });
  }

  return tasks;
}

/** Ручное создание плана ухода — предпочитает интервалы из паспорта ухода, если он уже есть. */
export const createDefaultTasks = async (
  plantId: string,
  addTask: (task: CareTask) => Promise<void>,
  carePassport?: PlantReport['carePassport'],
) => {
  const derived = carePassport ? deriveTasksFromCarePassport(carePassport) : [];
  const tasksToCreate = derived.length > 0 ? derived : DEFAULT_TASKS;

  for (const def of tasksToCreate) {
    await addTask({
      id: crypto.randomUUID(),
      plantId,
      type: def.type,
      intervalDays: def.intervalDays,
      lastDoneAt: null,
    });
  }
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const PHOTO_BACKOFF_INTERVAL_DAYS = 14;
const PHOTO_BACKOFF_MISSED_CYCLES = 2;

/** US-ALBUM-5: если фото-напоминание проигнорировали 2 полных цикла подряд, увеличиваем интервал до 14 дней. */
export const shouldApplyPhotoBackoff = (task: CareTask, now: number): boolean => {
  if (task.type !== 'photo' || task.lastDoneAt === null) {
    return false;
  }

  if (task.intervalDays >= PHOTO_BACKOFF_INTERVAL_DAYS) {
    return false;
  }

  const overdueMs = now - task.lastDoneAt - daysToMs(task.intervalDays);
  return overdueMs >= daysToMs(task.intervalDays * PHOTO_BACKOFF_MISSED_CYCLES);
};

export const formatDue = (nextDue: number): string => {
  const now = Date.now();
  const diffDays = Math.round((nextDue - now) / MS_PER_DAY);

  if (diffDays < 0) {
    const overdue = Math.abs(diffDays);
    return `Просрочено на ${overdue} ${pluralDays(overdue)}`;
  }

  if (diffDays === 0) {
    return 'Сегодня';
  }

  if (diffDays === 1) {
    return 'Завтра';
  }

  return `Через ${diffDays} ${pluralDays(diffDays)}`;
};
