import type { PhotoEntry, Plant } from '../models/plant.types';
import { createContext } from 'react';

type PlantsContextValue = {
  plants: Plant[];
  addPlant: (plant: Plant) => Promise<void>;
  addPhoto: (plantId: string, photo: PhotoEntry) => Promise<void>;
  loading: boolean;
};

export const PlantsContext = createContext<PlantsContextValue | null>(null);
