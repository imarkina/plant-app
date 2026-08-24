import type { PhotoEntry, Plant, PlantsRepository } from './plant.types';

import { supabase } from '../../../shared/supabase/client';
import { supbaseRowToPlant } from './plant.mappers';

class SupabasePlantsRepository implements PlantsRepository {
  async getAll(): Promise<Plant[]> {
    const { data, error } = await supabase.from('plants').select('*, photos(*)');

    if (error) {
      throw error;
    }

    return data.map(supbaseRowToPlant);
  }

  async save(plant: Plant): Promise<void> {
    const { error } = await supabase.from('plants').insert({ id: plant.id, name: plant.name });

    if (error) {
      throw error;
    }

    for (const photo of plant.photos) {
      await this.addPhoto(plant.id, photo);
    }
  }

  async addPhoto(plantId: string, photo: PhotoEntry): Promise<void> {
    const path = `${plantId}/${photo.id}.jpg`;
    let imageUrl;

    if (photo.image) {
      const { error: uploadError } = await supabase.storage
        .from('plant-photos')
        .upload(path, photo.image, { contentType: photo.image.type });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('plant-photos').getPublicUrl(path);

      imageUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase.from('photos').insert({
      id: photo.id,
      plant_id: plantId,
      created_at: new Date(photo.createdAt).toISOString(),
      analysis: photo.analysis,
      image_url: imageUrl,
    });

    if (insertError) {
      throw insertError;
    }
  }
}

export const plantsRepository = new SupabasePlantsRepository();
