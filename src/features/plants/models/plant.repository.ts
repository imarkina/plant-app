import type { PhotoEntry, PhotoType, Plant, PlantProfileUpdate, PlantsRepository } from './plant.types';
import type { PlantReport } from './plant-report.types';

import { supabase } from '../../../shared/supabase/client';
import { unwrap } from '../../../shared/supabase/unwrap';
import { mapPlantProfileUpdateToRow, mapPlantRowToPlant } from './plant.mappers';

const PLANTS_TABLE = 'plants';
const PHOTOS_TABLE = 'photos';
const PLANT_PHOTOS_BUCKET = 'plant-photos';
const PHOTO_FILE_EXTENSION = 'jpg';

function buildPhotoStoragePath(plantId: string, photoId: string): string {
  return `${plantId}/${photoId}.${PHOTO_FILE_EXTENSION}`;
}

class SupabasePlantsRepository implements PlantsRepository {
  async getAll(): Promise<Plant[]> {
    const rows = unwrap(await supabase.from(PLANTS_TABLE).select('*, photos(*)'));

    return rows.map(mapPlantRowToPlant);
  }

  async save(plant: Plant): Promise<Plant> {
    unwrap(await supabase.from(PLANTS_TABLE).insert({ id: plant.id, name: plant.name }));

    const savedPhotos: PhotoEntry[] = [];
    for (const photo of plant.photos) {
      savedPhotos.push(await this.addPhoto(plant.id, photo));
    }

    return { ...plant, photos: savedPhotos };
  }

  async addPhoto(plantId: string, photo: PhotoEntry): Promise<PhotoEntry> {
    const imageUrl = photo.image
      ? await this.uploadPhotoImage(plantId, photo.id, photo.image)
      : undefined;

    unwrap(
      await supabase.from(PHOTOS_TABLE).insert({
        id: photo.id,
        plant_id: plantId,
        created_at: new Date(photo.createdAt).toISOString(),
        analysis: photo.analysis,
        embedding: photo.embedding ?? null,
        image_url: imageUrl,
        photo_type: photo.type,
        note: photo.note ?? null,
      }),
    );

    return { ...photo, imageUrl };
  }

  async deletePhoto(plantId: string, photoId: string): Promise<void> {
    unwrap(
      await supabase.storage.from(PLANT_PHOTOS_BUCKET).remove([buildPhotoStoragePath(plantId, photoId)]),
    );

    unwrap(await supabase.from(PHOTOS_TABLE).delete().eq('id', photoId));
  }

  async updatePhotoType(photoId: string, type: PhotoType): Promise<void> {
    unwrap(await supabase.from(PHOTOS_TABLE).update({ photo_type: type }).eq('id', photoId));
  }

  async updatePhotoAnalysis(photoId: string, analysis: PlantReport, embedding: number[] | null): Promise<void> {
    unwrap(await supabase.from(PHOTOS_TABLE).update({ analysis, embedding }).eq('id', photoId));
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

  async setAvatarPhoto(plantId: string, photoId: string): Promise<void> {
    unwrap(await supabase.from(PHOTOS_TABLE).update({ is_avatar: false }).eq('plant_id', plantId));

    unwrap(await supabase.from(PHOTOS_TABLE).update({ is_avatar: true }).eq('id', photoId));
  }

  async updateProfile(plantId: string, update: PlantProfileUpdate): Promise<void> {
    const row = mapPlantProfileUpdateToRow(update);

    if (Object.keys(row).length === 0) {
      return;
    }

    unwrap(await supabase.from(PLANTS_TABLE).update(row).eq('id', plantId));
  }

  async deletePlant(plantId: string): Promise<void> {
    const { data: photos } = await supabase.from(PHOTOS_TABLE).select('id').eq('plant_id', plantId);
    const storagePaths = (photos ?? []).map((photo: { id: string }) =>
      buildPhotoStoragePath(plantId, photo.id),
    );

    if (storagePaths.length > 0) {
      await supabase.storage.from(PLANT_PHOTOS_BUCKET).remove(storagePaths);
    }

    unwrap(await supabase.from(PHOTOS_TABLE).delete().eq('plant_id', plantId));
    unwrap(await supabase.from('care_tasks').delete().eq('plant_id', plantId));
    unwrap(await supabase.from(PLANTS_TABLE).delete().eq('id', plantId));
  }
}

export const plantsRepository = new SupabasePlantsRepository();
