import type { PlantReport } from './plant-report.types';

export interface PhotoEntry {
  id: string;
  createdAt: number;
  image?: Blob;
  imageUrl?: string;
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
  addPhoto(plantId: string, photo: PhotoEntry): Promise<void>;
}
