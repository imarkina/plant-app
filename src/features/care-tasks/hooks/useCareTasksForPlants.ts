import { useEffect, useMemo, useState } from 'react';
import { careTasksRepository } from '../models/care-tasks.repository';
import type { CareTask } from '../models/care-tasks.model';

/** Batches care tasks for a list of plants (e.g. for grid badges) instead of one query per plant. */
export function useCareTasksForPlants(plantIds: string[]) {
  const [tasksByPlantId, setTasksByPlantId] = useState<Map<string, CareTask[]>>(new Map());
  const [loading, setLoading] = useState(true);

  const plantIdsKey = useMemo(() => plantIds.join(','), [plantIds]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const tasks = await careTasksRepository.getCareTasksForPlants(plantIds);

        if (cancelled) {
          return;
        }

        const grouped = new Map<string, CareTask[]>();

        for (const task of tasks) {
          const existing = grouped.get(task.plantId) ?? [];
          existing.push(task);
          grouped.set(task.plantId, existing);
        }

        setTasksByPlantId(grouped);
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

  return { tasksByPlantId, loading };
}
