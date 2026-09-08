export type CareTaskType = 'watering' | 'feeding' | 'misting' | 'photo';

export type CareStatus = 'overdue' | 'soon' | 'ok';

export interface CareTask {
  id: string;
  plantId: string;
  type: CareTaskType;
  intervalDays: number;
  lastDoneAt: number | null;
}

export interface CareTasksRepository {
  getCareTasks(plantId: string): Promise<CareTask[]>;
  getCareTasksForPlants(plantIds: string[]): Promise<CareTask[]>;
  addCareTask(task: CareTask): Promise<void>;
  markCareDone(taskId: string): Promise<void>;
  // deleteCareTask(taskId: string): Promise<void>;
  // updateCareTask(task: CareTask): Promise<void>;
}
