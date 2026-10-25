import { supabase } from '../../../shared/supabase/client';
import { unwrap } from '../../../shared/supabase/unwrap';
import type { PlantComparison, StoredPlantComparison } from './plant-comparison.types';

const TABLE = 'photo_comparisons';

interface ComparisonRow {
  id: string;
  plant_id: string;
  first_photo_id: string;
  last_photo_id: string;
  result: PlantComparison;
  embedding: number[] | null;
  created_at: string;
}

function mapRow(row: ComparisonRow): StoredPlantComparison {
  return {
    id: row.id,
    plantId: row.plant_id,
    firstPhotoId: row.first_photo_id,
    lastPhotoId: row.last_photo_id,
    result: row.result,
    createdAt: new Date(row.created_at).getTime(),
  };
}

class SupabasePlantComparisonRepository {
  /**
   * Последнее сравнение для растения вообще, а не для конкретной пары фото —
   * иначе добавление нового фото меняет "последнее" фото пары, и уже
   * посчитанный результат становится ненаходимым по точному ключу.
   */
  async findLatestForPlant(plantId: string): Promise<StoredPlantComparison | null> {
    // `result` is the DB's generic jsonb column, narrowed here to PlantComparison --
    // it's only ever written as the parsed, Zod-validated Gemini response below.
    const rows = unwrap(
      await supabase
        .from(TABLE)
        .select('*')
        .eq('plant_id', plantId)
        .order('created_at', { ascending: false })
        .limit(1),
    ) as unknown as ComparisonRow[];

    return rows[0] ? mapRow(rows[0]) : null;
  }

  /**
   * Upserts by (first_photo_id, last_photo_id) — `id`/`created_at` are left
   * out of the payload so a re-save keeps the original row's id instead of
   * minting a new one on conflict.
   */
  async save(
    plantId: string,
    firstPhotoId: string,
    lastPhotoId: string,
    result: PlantComparison,
    embedding: number[] | null,
  ): Promise<StoredPlantComparison> {
    const rows = unwrap(
      await supabase
        .from(TABLE)
        .upsert(
          {
            plant_id: plantId,
            first_photo_id: firstPhotoId,
            last_photo_id: lastPhotoId,
            result,
            embedding,
          },
          { onConflict: 'first_photo_id,last_photo_id' },
        )
        .select('*'),
    ) as unknown as ComparisonRow[];

    return mapRow(rows[0]);
  }
}

export const plantComparisonRepository = new SupabasePlantComparisonRepository();
