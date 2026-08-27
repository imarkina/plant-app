import { careTasksRepository } from '../models/care-tasks.repository';
import { useEffect, useState } from 'react';
import type { CareTask } from '../models/care-tasks.model';

export const useCareTasks = (plantId: string) => {
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [loading, setLoading] = useState(true);

  const getCareTasks = async () => {
    try {
      setLoading(true);

      const data = await careTasksRepository.getCareTasks(plantId);

      setTasks(data);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getCareTasks();
  }, [plantId]);

  const markDone = async (taskId: string) => {
    await careTasksRepository.markCareDone(taskId);
    await getCareTasks();
  };

  const addTask = async (task: CareTask) => {
    await careTasksRepository.addCareTask(task);
    await getCareTasks();
  };

  return { tasks, loading, markDone, addTask };
};
