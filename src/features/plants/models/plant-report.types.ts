import type {
  PlantHealthSchema,
  PlantReportSchema,
  ThreatLevelSchema,
} from '../../../server/analyze-plant-image.shema';
import type { CompareStatusSchema } from '../../../server/compare-plants.schema';

export type HealthStatus = PlantHealthSchema;
export type ThreatLevel = ThreatLevelSchema;
export type PlantReport = PlantReportSchema;
export type CompareStatus = CompareStatusSchema;
