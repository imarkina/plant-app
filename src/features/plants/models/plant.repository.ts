import type { Plant, PlantRepositorySchema, PlantsRepository } from './plant.types';
import { type IDBPDatabase, openDB } from 'idb';

const DB_NAME = 'plant-app';
const DB_VERSION = 1;

class IndexedDbPlantsRepository implements PlantsRepository {
  private dbPromise?: Promise<IDBPDatabase<PlantRepositorySchema>>;

  private init() {
    if (!this.dbPromise) {
      this.dbPromise = openDB<PlantRepositorySchema>(DB_NAME, DB_VERSION, {
        upgrade(database) {
          if (!database.objectStoreNames.contains('plants')) {
            database.createObjectStore('plants', { keyPath: 'id' });
          }
        },
      });
    }

    return this.dbPromise;
  }

  async getAll(): Promise<Plant[]> {
    const db = await this.init();

    return db.getAll('plants');
  }

  async save(plant: Plant): Promise<void> {
    const db = await this.init();

    await db.put('plants', plant);
  }
}

export const plantsRepository = new IndexedDbPlantsRepository();
