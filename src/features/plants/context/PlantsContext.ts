import type { PhotoEntry, Plant, PlantProfileUpdate } from '../models/plant.types';
import type { PlantReport } from '../models/plant-report.types';
import { createContext } from 'react';

type PlantsContextValue = {
  plants: Plant[];
  loading: boolean;
  addPlant: (plant: Plant) => Promise<void>;
  addPhoto: (plantId: string, photo: PhotoEntry) => Promise<void>;
  deletePhoto: (plantId: string, photoId: string) => Promise<void>;
  setAvatarPhoto: (plantId: string, photoId: string) => Promise<void>;
  updateProfile: (plantId: string, update: PlantProfileUpdate) => Promise<void>;
  retryPhotoAnalysis: (
    plantId: string,
    photoId: string,
    analysis: PlantReport,
    embedding: number[] | null,
  ) => Promise<void>;
  deletePlant: (plantId: string) => Promise<void>;
};

export const PlantsContext = createContext<PlantsContextValue | null>(null);
