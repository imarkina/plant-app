export interface PhotoEntry {
  id: string;
  createdAt: number;
  image: Blob;
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
