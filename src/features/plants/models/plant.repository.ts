import type { Plant, PlantsRepository } from './plant.types';

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
    for (const photo of plant.photos) {
      const path = `${plant.id}/${photo.id}.jpg`;
      if (photo.image) {
        await supabase.storage.from('plant-photos').upload(path, photo.image);

        const { data } = supabase.storage.from('plant-photos').getPublicUrl(path);

        photo.imageUrl = data.publicUrl;
      }
    }

    await supabase.from('plants').insert({ id: plant.id, name: plant.name });

    await supabase.from('photos').insert(
      plant.photos.map((p) => ({
        id: p.id,
        plant_id: plant.id,
        created_at: new Date(p.createdAt).toISOString(),
        analysis: p.analysis,
        image_url: p.imageUrl,
      })),
    );
    return Promise.resolve(undefined);
  }
}

export const plantsRepository = new SupabasePlantsRepository();
