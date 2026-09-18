import { useMemo } from 'react';
import { usePlantsContext } from '../../plants/hooks/usePlantsContext';
import { useCareTasksForPlants } from '../../care-tasks';
import { buildCalendarEvents, buildMonthGrid, getCalendarNow, groupEventsByDay } from '../models/calendar.helpers';

/** Растения + их задачи ухода/фото, спроецированные на видимый месяц. Данные уже в кэше TanStack Query — новых запросов к сети это не добавляет. */
export function useCalendarEvents(year: number, month: number) {
  const { plants, loading: plantsLoading } = usePlantsContext();
  const activePlants = useMemo(() => plants.filter((plant) => !plant.isArchived), [plants]);
  const plantIds = useMemo(() => activePlants.map((plant) => plant.id), [activePlants]);
  const { tasksByPlantId, loading: tasksLoading } = useCareTasksForPlants(plantIds);

  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const rangeStart = weeks[0][0];
  const rangeEnd = weeks[weeks.length - 1][6];

  const events = useMemo(
    () => buildCalendarEvents(activePlants, tasksByPlantId, rangeStart, rangeEnd, getCalendarNow()),
    [activePlants, tasksByPlantId, rangeStart, rangeEnd],
  );

  const eventsByDay = useMemo(() => groupEventsByDay(events), [events]);

  return {
    weeks,
    eventsByDay,
    plants: activePlants,
    loading: plantsLoading || tasksLoading,
  };
}
