import type {
  ArchiveStatus,
  PhotoEntry,
  PhotoType,
  Plant,
  PlantProfileUpdate,
  PlantsRepository,
} from './plant.types';

import { supabase } from '../../../shared/supabase/client';
import { mapPlantProfileUpdateToRow, mapPlantRowToPlant } from './plant.mappers';

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

  async getActive(): Promise<Plant[]> {
    return this.getAllFilteredByArchiveState(false);
  }

  async getArchived(): Promise<Plant[]> {
    return this.getAllFilteredByArchiveState(true);
  }

  private async getAllFilteredByArchiveState(isArchived: boolean): Promise<Plant[]> {
    const rows = unwrap(
      await supabase.from(PLANTS_TABLE).select('*, photos(*)').eq('is_archived', isArchived),
    );

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

  async archive(
    plantId: string,
    status: ArchiveStatus,
    reasonDetail?: string | null,
  ): Promise<void> {
    unwrap(
      await supabase
        .from(PLANTS_TABLE)
        .update({
          is_archived: true,
          archive_status: status,
          archive_reason_detail: reasonDetail ?? null,
          archived_at: new Date().toISOString(),
        })
        .eq('id', plantId),
    );
  }

  async restore(plantId: string): Promise<void> {
    unwrap(
      await supabase
        .from(PLANTS_TABLE)
        .update({
          is_archived: false,
          archive_status: null,
          archive_reason_detail: null,
          archived_at: null,
        })
        .eq('id', plantId),
    );
  }

  async deletePlant(plantId: string): Promise<void> {
    const { data: photos } = await supabase.from(PHOTOS_TABLE).select('id').eq('plant_id', plantId);
    const storagePaths = (photos ?? []).map((photo) => buildPhotoStoragePath(plantId, photo.id));

    if (storagePaths.length > 0) {
      await supabase.storage.from(PLANT_PHOTOS_BUCKET).remove(storagePaths);
    }

    unwrap(await supabase.from(PHOTOS_TABLE).delete().eq('plant_id', plantId));
    unwrap(await supabase.from('care_tasks').delete().eq('plant_id', plantId));
    unwrap(await supabase.from(PLANTS_TABLE).delete().eq('id', plantId));
  }
}

export const plantsRepository = new SupabasePlantsRepository();
