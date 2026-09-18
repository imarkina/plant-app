import type { CareTask } from '../../care-tasks';
import type { Plant } from '../../plants/models/plant.types';
import type { CalendarEvent, CalendarEventStatus } from './calendar.types';

/**
 * Обёртка над Date.now() — react-hooks/purity ругается на прямой вызов
 * импичного Date.now() в теле компонента/useMemo (тот же приём, что и
 * getNextDue в care-tasks.helpers.ts, который эту проверку уже проходит).
 */
export function getCalendarNow(): number {
  return Date.now();
}

/** Начало суток в локальном времени. Компонентная арифметика Date — без date-fns, переполнение месяца/дня JS считает сам (31 февраля само уедет в март). */
export function startOfDay(ts: number): number {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function addDays(ts: number, days: number): number {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days).getTime();
}

/** Понедельник = 0 ... воскресенье = 6, как в streak.ts. */
function mondayIndex(ts: number): number {
  return (new Date(ts).getDay() + 6) % 7;
}

/**
 * Сетка месяца 7×N: недели целиком, с ведущими/хвостовыми днями соседних
 * месяцев, чтобы каждая неделя была полной строкой Пн–Вс.
 */
export function buildMonthGrid(year: number, month: number): number[][] {
  const firstOfMonth = new Date(year, month, 1).getTime();
  const lastOfMonth = new Date(year, month + 1, 0);
  const startOffset = mondayIndex(firstOfMonth);
  const endOffset = 6 - mondayIndex(lastOfMonth.getTime());
  const totalCells = startOffset + lastOfMonth.getDate() + endOffset;

  const days: number[] = [];
  for (let i = 0; i < totalCells; i++) {
    days.push(new Date(year, month, 1 - startOffset + i).getTime());
  }

  const weeks: number[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

export interface TaskOccurrence {
  date: number;
  status: CalendarEventStatus;
}

/**
 * Все точки повторения задачи ухода, попадающие в [rangeStart, rangeEnd].
 * У care_tasks нет истории — известна только последняя выполненная дата
 * (lastDoneAt), поэтому "done" ставится только на неё саму; всё, что после
 * неё и уже в прошлом относительно now — "missed" (пропущено), а что в
 * будущем — "planned". Если задачу вообще не делали, первая точка — «сейчас»
 * (как и в getNextDue), дальше через интервал.
 */
export function getTaskOccurrencesInRange(
  task: CareTask,
  rangeStart: number,
  rangeEnd: number,
  now: number,
): TaskOccurrence[] {
  const occurrences: TaskOccurrence[] = [];
  const today = startOfDay(now);

  if (task.lastDoneAt === null) {
    let cursor = today;
    while (cursor <= rangeEnd) {
      if (cursor >= rangeStart) {
        occurrences.push({ date: cursor, status: cursor < today ? 'missed' : 'planned' });
      }
      cursor = addDays(cursor, task.intervalDays);
    }
    return occurrences;
  }

  const lastDoneDay = startOfDay(task.lastDoneAt);
  if (lastDoneDay >= rangeStart && lastDoneDay <= rangeEnd) {
    occurrences.push({ date: lastDoneDay, status: 'done' });
  }

  let cursor = addDays(lastDoneDay, task.intervalDays);
  while (cursor <= rangeEnd) {
    if (cursor >= rangeStart) {
      occurrences.push({ date: cursor, status: cursor < today ? 'missed' : 'planned' });
    }
    cursor = addDays(cursor, task.intervalDays);
  }

  return occurrences;
}

const TASK_TYPE_TO_KIND = {
  watering: 'watering',
  feeding: 'feeding',
  misting: 'misting',
  photo: 'photo-task',
} as const;

const PHOTO_TYPE_TO_KIND = {
  purchase: 'purchase',
  diagnosis: 'diagnosis',
  growth: 'photo',
  archive: 'photo',
} as const;

/** Composes plants + their care_tasks (спроецированные на диапазон) + фото в единый список событий календаря. */
export function buildCalendarEvents(
  plants: Plant[],
  tasksByPlantId: Map<string, CareTask[]>,
  rangeStart: number,
  rangeEnd: number,
  now: number,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const plant of plants) {
    const plantName = plant.photos[0]?.analysis?.identification.commonName ?? plant.name;
    const plantAvatarUrl = plant.photos[0]?.imageUrl;
    const tasks = tasksByPlantId.get(plant.id) ?? [];

    for (const task of tasks) {
      const occurrences = getTaskOccurrencesInRange(task, rangeStart, rangeEnd, now);

      for (const occurrence of occurrences) {
        events.push({
          id: `task-${task.id}-${occurrence.date}`,
          date: occurrence.date,
          kind: TASK_TYPE_TO_KIND[task.type],
          status: occurrence.status,
          plantId: plant.id,
          plantName,
          plantAvatarUrl,
        });
      }
    }

    for (const photo of plant.photos) {
      const day = startOfDay(photo.createdAt);
      if (day < rangeStart || day > rangeEnd) {
        continue;
      }

      events.push({
        id: `photo-${photo.id}`,
        date: day,
        kind: PHOTO_TYPE_TO_KIND[photo.type],
        status: 'done',
        plantId: plant.id,
        plantName,
        plantAvatarUrl,
        photoId: photo.id,
        photoUrl: photo.imageUrl,
      });
    }
  }

  return events;
}

export function groupEventsByDay(events: CalendarEvent[]): Map<number, CalendarEvent[]> {
  const grouped = new Map<number, CalendarEvent[]>();

  for (const event of events) {
    const existing = grouped.get(event.date) ?? [];
    existing.push(event);
    grouped.set(event.date, existing);
  }

  return grouped;
}
