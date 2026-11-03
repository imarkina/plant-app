import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const plantIdsKey = useMemo(() => plantIds.join(','), [plantIds]);
  const queryKey = useMemo(() => ['care-tasks', 'plants', plantIdsKey] as const, [plantIdsKey]);

  const tasksQuery = useQuery({
    queryKey,
    queryFn: () => careTasksRepository.getCareTasksForPlants(plantIds),
  });

  const tasksByPlantId = useMemo(() => groupByPlantId(tasksQuery.data ?? []), [tasksQuery.data]);

  const patchTasks = (updater: (tasks: CareTask[]) => CareTask[]) => {
    queryClient.setQueryData<CareTask[]>(queryKey, (current) => updater(current ?? []));
  };

  const markDoneMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await careTasksRepository.markCareDone(taskId);
      return taskId;
    },
    onSuccess: (taskId) => {
      const doneAt = Date.now();
      patchTasks((current) => current.map((task) => (task.id === taskId ? { ...task, lastDoneAt: doneAt } : task)));
    },
  });

  /** US-ALBUM-5: bumps ignored photo reminders to a slower cadence. Returns how many were bumped. */
  const applyPhotoBackoffMutation = useMutation({
    mutationFn: async () => {
      const now = Date.now();
      const allTasks = [...tasksByPlantId.values()].flat();
      const toBump = allTasks.filter((task) => shouldApplyPhotoBackoff(task, now));

      for (const task of toBump) {
        await careTasksRepository.updateCareTask({ ...task, intervalDays: PHOTO_BACKOFF_INTERVAL_DAYS });
      }

      return toBump.map((task) => task.id);
    },
    onSuccess: (bumpedTaskIds) => {
      if (bumpedTaskIds.length === 0) {
        return;
      }

      patchTasks((current) =>
        current.map((task) =>
          bumpedTaskIds.includes(task.id) ? { ...task, intervalDays: PHOTO_BACKOFF_INTERVAL_DAYS } : task,
        ),
      );
    },
  });

  return {
    tasksByPlantId,
    loading: tasksQuery.isPending,
    markDone: (taskId: string) => markDoneMutation.mutateAsync(taskId).then(() => undefined),
    applyPhotoBackoff: () => applyPhotoBackoffMutation.mutateAsync().then((bumped) => bumped.length),
  };
}
