import type { PhotoEntry, Plant, PlantsRepository } from './plant.types';

import { supabase } from '../../../shared/supabase/client';
import { mapPlantRowToPlant } from './plant.mappers';

const PLANTS_TABLE = 'plants';
const PHOTOS_TABLE = 'photos';
const PLANT_PHOTOS_BUCKET = 'plant-photos';
const PHOTO_FILE_EXTENSION = 'jpg';

/** Throws on a Supabase error, otherwise returns the (guaranteed non-null) data. */
function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) {
    throw error;
  }

  return data as T;
}

function buildPhotoStoragePath(plantId: string, photoId: string): string {
  return `${plantId}/${photoId}.${PHOTO_FILE_EXTENSION}`;
}

class SupabasePlantsRepository implements PlantsRepository {
  async getAll(): Promise<Plant[]> {
    const rows = unwrap(await supabase.from(PLANTS_TABLE).select('*, photos(*)'));

    return rows.map(mapPlantRowToPlant);
  }

  async save(plant: Plant): Promise<void> {
    unwrap(await supabase.from(PLANTS_TABLE).insert({ id: plant.id, name: plant.name }));

    for (const photo of plant.photos) {
      await this.addPhoto(plant.id, photo);
    }
  }

  async addPhoto(plantId: string, photo: PhotoEntry): Promise<void> {
    const imageUrl = photo.image
      ? await this.uploadPhotoImage(plantId, photo.id, photo.image)
      : undefined;

    unwrap(
      await supabase.from(PHOTOS_TABLE).insert({
        id: photo.id,
        plant_id: plantId,
        created_at: new Date(photo.createdAt).toISOString(),
        analysis: photo.analysis,
        image_url: imageUrl,
      }),
    );
  }

  private async uploadPhotoImage(plantId: string, photoId: string, image: Blob): Promise<string> {
    const storagePath = buildPhotoStoragePath(plantId, photoId);

    unwrap(
      await supabase.storage
        .from(PLANT_PHOTOS_BUCKET)
        .upload(storagePath, image, { contentType: image.type }),
    );

    const { data } = supabase.storage.from(PLANT_PHOTOS_BUCKET).getPublicUrl(storagePath);

    return data.publicUrl;
  }
}

export const plantsRepository = new SupabasePlantsRepository();
