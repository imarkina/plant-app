import type { ArchiveStatus, PhotoEntry, Plant, PlantProfileUpdate } from '../models/plant.types';
import { createContext } from 'react';

type PlantsContextValue = {
  plants: Plant[];
  loading: boolean;
  addPlant: (plant: Plant) => Promise<void>;
  addPhoto: (plantId: string, photo: PhotoEntry) => Promise<void>;
  deletePhoto: (plantId: string, photoId: string) => Promise<void>;
  setAvatarPhoto: (plantId: string, photoId: string) => Promise<void>;
  updateProfile: (plantId: string, update: PlantProfileUpdate) => Promise<void>;
  archive: (plantId: string, status: ArchiveStatus, reasonDetail?: string | null) => Promise<void>;
  restore: (plantId: string) => Promise<void>;
  deletePlant: (plantId: string) => Promise<void>;
};

export const PlantsContext = createContext<PlantsContextValue | null>(null);
