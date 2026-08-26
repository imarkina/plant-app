import { careTasksRepository } from '../models/care-tasks.repository';

export const useCareTasks = () => {
  const getCareTasks = async (plantId: string) => {
    return await careTasksRepository.getCareTasks(plantId);
  };

  return {
    getCareTasks,
  };
};
