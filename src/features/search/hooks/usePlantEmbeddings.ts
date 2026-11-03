import { useMemo } from 'react';
import type { Plant } from '../../plants/models/plant.types';
import type { PlantEmbedding } from '../model/search.types';

/**
 * Эмбеддинг диагноза считается и сохраняется один раз в БД (photos.embedding)
 * в момент AI-анализа фото (plants/models/search-embeddings.ts) — здесь просто
 * читаем уже готовый вектор из уже загруженных растений, без сетевых запросов.
 * Растение без закэшированного эмбеддинга (диагноз ещё не пересчитывался после
 * появления кэша, либо расчёт когда-то не удался) в поиске не участвует.
 */
export function usePlantEmbeddings(plants: Plant[]): PlantEmbedding[] {
  return useMemo(() => {
    const embeddings: PlantEmbedding[] = [];

    for (const plant of plants) {
      const latestAnalyzed = [...plant.photos].reverse().find((photo) => photo.analysis);

      if (latestAnalyzed?.embedding) {
        embeddings.push({ plantId: plant.id, name: plant.name, embedding: latestAnalyzed.embedding });
      }
    }

    return embeddings;
  }, [plants]);
}
