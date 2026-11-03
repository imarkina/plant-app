import { useQueryClient } from '@tanstack/react-query';
import { careTasksRepository } from '../models/care-tasks.repository';
import { deriveTasksFromCarePassport } from '../models/care-tasks.helpers';
import type { PlantReport } from '../../plants/models/plant-report.types';

/**
 * Создаёт/обновляет watering/feeding/misting задачи ухода интервалами из
 * паспорта ухода, который вернул Gemini — вызывается после каждого нового
 * диагноза (создание растения, новое фото, повтор анализа), чтобы план ухода
 * не оставался на захардкоженных умолчаниях и подстраивался под конкретное
 * растение.
 */
export function useApplyCarePassport() {
  const queryClient = useQueryClient();

  return async (plantId: string, carePassport: PlantReport['carePassport'] | undefined) => {
    if (!carePassport) {
      return;
    }

    const derived = deriveTasksFromCarePassport(carePassport);
    if (derived.length === 0) {
      return;
    }

    const existingTasks = await careTasksRepository.getCareTasks(plantId);

    for (const { type, intervalDays } of derived) {
      const existingTask = existingTasks.find((task) => task.type === type);

      if (existingTask) {
        if (existingTask.intervalDays !== intervalDays) {
          await careTasksRepository.updateCareTask({ ...existingTask, intervalDays });
        }
      } else {
        await careTasksRepository.addCareTask({
          id: crypto.randomUUID(),
          plantId,
          type,
          intervalDays,
          lastDoneAt: null,
        });
      }
    }

    void queryClient.invalidateQueries({ queryKey: ['care-tasks'] });
  };
}
