import { useEffect, useMemo, useState } from 'react';
import type { Plant } from '../../plants/models/plant.types';
import type { PlantEmbedding } from '../model/search.types';
import { getEmbedding } from '../model/embedding.service';
import { buildPlantEmbeddingText } from '../model/plant-embedding-text';

/**
 * Считает embeddings диагнозов "на лету" при изменении списка растений — без хранения
 * в БД (Этап 1, см. обсуждение в задаче). Для большого числа растений это будет
 * медленно и жечь запросы к Gemini на каждый рендер списка; следующий шаг —
 * предпосчитывать и хранить вектор (например, через pgvector в Supabase).
 */
export function usePlantEmbeddings(plants: Plant[]) {
  const [plantEmbeddings, setPlantEmbeddings] = useState<PlantEmbedding[]>([]);
  const [loading, setLoading] = useState(false);

  // Пересчитываем только когда реально меняется набор id, а не на каждый рендер.
  const plantIdsKey = useMemo(() => plants.map((plant) => plant.id).join(','), [plants]);

  useEffect(() => {
    let cancelled = false;

    const loadEmbeddings = async () => {
      const plantsWithText = plants
        .map((plant) => ({ plant, text: buildPlantEmbeddingText(plant) }))
        .filter((entry): entry is { plant: Plant; text: string } => entry.text !== null);

      if (plantsWithText.length === 0) {
        if (!cancelled) {
          setPlantEmbeddings([]);
        }
        return;
      }

      setLoading(true);

      try {
        const embeddings = await Promise.all(
          plantsWithText.map(async ({ plant, text }) => ({
            plantId: plant.id,
            name: plant.name,
            text,
            embedding: await getEmbedding(text),
          })),
        );

        if (!cancelled) {
          setPlantEmbeddings(embeddings);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEmbeddings();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantIdsKey]);

  return { plantEmbeddings, loading };
}
