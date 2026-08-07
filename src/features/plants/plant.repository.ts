import type { Plant, PlantsRepository } from './plant.types';

const STORAGE_KEY = 'plants';

class LocalStoragePlantsRepository implements PlantsRepository {
  getAll(): Promise<Plant[]> {
    const items = localStorage.getItem(STORAGE_KEY);
    const plants: Plant[] = items ? JSON.parse(items) : [];

    return Promise.resolve(plants);
  }

  async save(plant: Plant): Promise<void> {
    const plants = await this.getAll();

    const existingPlantIndex = plants.findIndex((p) => p.id === plant.id);

    if (existingPlantIndex !== -1) {
      plants.splice(existingPlantIndex, 1, plant);
    } else {
      plants.push(plant);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    return undefined;
  }
}

export const localStoragePlantsRepository = new LocalStoragePlantsRepository();
