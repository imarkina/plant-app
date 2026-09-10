import { useEffect, useMemo, useState } from 'react';
import { careTasksRepository } from '../models/care-tasks.repository';
import type { CareTask } from '../models/care-tasks.model';
import { PHOTO_BACKOFF_INTERVAL_DAYS, shouldApplyPhotoBackoff } from '../models/care-tasks.helpers';

const groupByPlantId = (tasks: CareTask[]): Map<string, CareTask[]> => {
  const grouped = new Map<string, CareTask[]>();

  for (const task of tasks) {
    const existing = grouped.get(task.plantId) ?? [];
    existing.push(task);
    grouped.set(task.plantId, existing);
  }

  return grouped;
};

/** Batches care tasks for a list of plants (e.g. for grid badges) instead of one query per plant. */
export function useCareTasksForPlants(plantIds: string[]) {
  const [tasksByPlantId, setTasksByPlantId] = useState<Map<string, CareTask[]>>(new Map());
  const [loading, setLoading] = useState(true);

  const plantIdsKey = useMemo(() => plantIds.join(','), [plantIds]);

  const refresh = async () => {
    const tasks = await careTasksRepository.getCareTasksForPlants(plantIds);
    setTasksByPlantId(groupByPlantId(tasks));
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const tasks = await careTasksRepository.getCareTasksForPlants(plantIds);

        if (!cancelled) {
          setTasksByPlantId(groupByPlantId(tasks));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantIdsKey]);

  const markDone = async (taskId: string) => {
    await careTasksRepository.markCareDone(taskId);
    await refresh();
  };

  /** US-ALBUM-5: bumps ignored photo reminders to a slower cadence. Returns how many were bumped. */
  const applyPhotoBackoff = async (): Promise<number> => {
    const now = Date.now();
    const allTasks = [...tasksByPlantId.values()].flat();
    const toBump = allTasks.filter((task) => shouldApplyPhotoBackoff(task, now));

    for (const task of toBump) {
      await careTasksRepository.updateCareTask({ ...task, intervalDays: PHOTO_BACKOFF_INTERVAL_DAYS });
    }

    if (toBump.length > 0) {
      await refresh();
    }

    return toBump.length;
  };

  return { tasksByPlantId, loading, markDone, applyPhotoBackoff };
}
