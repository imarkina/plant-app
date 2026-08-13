import type { PlantReport } from './plant-report.types';
import type { DBSchema } from 'idb';

export interface PhotoEntry {
  id: string;
  createdAt: number;
  image?: Blob;
  analysis?: PlantReport;
}

export interface Plant {
  id: string;
  name: string;
  photos: PhotoEntry[];
}

export interface PlantsRepository {
  getAll(): Promise<Plant[]>;
  save(plant: Plant): Promise<void>;
}

export interface PlantRepositorySchema extends DBSchema {
  plants: {
    key: string;
    value: Plant;
  };
}
