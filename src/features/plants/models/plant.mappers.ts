import type { PlantReport } from './plant-report.types';
import type { PhotoEntry, Plant } from './plant.types';

interface SupabasePhotoRow {
  id: string;
  created_at: string;
  image_url: string | null;
  analysis: PlantReport | null;
}

interface SupabasePlantRow {
  id: string;
  name: string;
  photos: SupabasePhotoRow[];
}

export function mapPhotoRowToPhotoEntry(row: SupabasePhotoRow): PhotoEntry {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    imageUrl: row.image_url ?? undefined,
    analysis: row.analysis ?? undefined,
  };
}

export function mapPlantRowToPlant(row: SupabasePlantRow): Plant {
  return {
    id: row.id,
    name: row.name,
    photos: row.photos.map(mapPhotoRowToPhotoEntry),
  };
}
