import type { Plant } from '../../plants/models/plant.types';

/**
 * Собирает текст диагноза растения для эмбеддинга из последнего фото с анализом.
 * Возвращает null, если анализа ещё нет — такое растение не участвует в поиске.
 */
export function buildPlantEmbeddingText(plant: Plant): string | null {
  const latestAnalysis = [...plant.photos].reverse().find((photo) => photo.analysis)?.analysis;

  if (!latestAnalysis) {
    return null;
  }

  const { health } = latestAnalysis;

  return [
    plant.name,
    health.description,
    health.diagnosis,
  ]
    .filter(Boolean)
    .join('. ');
}
