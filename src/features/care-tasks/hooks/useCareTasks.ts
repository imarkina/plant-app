import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { careTasksRepository } from '../models/care-tasks.repository';
import type { CareTask } from '../models/care-tasks.model';

/**
 * Тот же ключ, что использует единственный вызывающий его хук ниже per-plantId —
 * важно, потому что и PlantDetailTabs, и вложенный в него CareTab дергают
 * useCareTasks(plant.id) с одним и тем же plantId. Раньше это были два
 * независимых useState — отметил задачу выполненной в CareTab, а хедер
 * (PlantDetailTabs → PlantOverviewTab) не узнавал об этом, пока страница не
 * перемонтируется. С общим ключом TanStack Query оба места видят один и тот
 * же закэшированный список и обновляются синхронно.
 */
export const careTasksKey = (plantId: string) => ['care-tasks', 'plant', plantId] as const;

export const useCareTasks = (plantId: string) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: careTasksKey(plantId),
    queryFn: () => careTasksRepository.getCareTasks(plantId),
  });

  const tasks = tasksQuery.data ?? [];

  const patchTasks = (updater: (tasks: CareTask[]) => CareTask[]) => {
    queryClient.setQueryData<CareTask[]>(careTasksKey(plantId), (current) => updater(current ?? []));
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

  const addTaskMutation = useMutation({
    mutationFn: async (task: CareTask) => {
      await careTasksRepository.addCareTask(task);
      return task;
    },
    onSuccess: (task) => {
      patchTasks((current) => [...current, task]);
    },
  });

  return {
    tasks,
    loading: tasksQuery.isPending,
    markDone: (taskId: string) => markDoneMutation.mutateAsync(taskId).then(() => undefined),
    addTask: (task: CareTask) => addTaskMutation.mutateAsync(task).then(() => undefined),
  };
};
