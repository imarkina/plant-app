import type { PlantComparisonSchema } from '../../../server/compare-plants.schema';

export type PlantComparison = PlantComparisonSchema;

/** A comparison result persisted for a specific pair of photos — see plant-comparison.repository.ts. */
export interface StoredPlantComparison {
  id: string;
  plantId: string;
  firstPhotoId: string;
  lastPhotoId: string;
  result: PlantComparison;
  createdAt: number;
}
