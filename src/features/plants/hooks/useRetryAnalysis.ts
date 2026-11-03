import { useState } from 'react';
import type { PhotoEntry } from '../models/plant.types';
import { computeDiagnosisEmbedding } from '../models/search-embeddings';
import { useApplyCarePassport } from '../../care-tasks';
import { usePlantsContext } from './usePlantsContext';
import { usePlantReport } from './usePlantReport';

const IMAGE_MISSING_MESSAGE = 'Не удалось найти фото для повторного анализа';

/** Повторно запускает AI-анализ фото, у которого он не сохранился при первой загрузке. */
export function useRetryAnalysis(plantId: string) {
  const { retryPhotoAnalysis } = usePlantsContext();
  const { fetchAnalysis, loading, error: analysisError } = usePlantReport();
  const applyCarePassport = useApplyCarePassport();
  const [imageError, setImageError] = useState<string | null>(null);

  const retry = async (photo: PhotoEntry): Promise<boolean> => {
    setImageError(null);

    if (!photo.imageUrl) {
      setImageError(IMAGE_MISSING_MESSAGE);
      return false;
    }

    const response = await fetch(photo.imageUrl);
    const blob = await response.blob();
    const analysis = await fetchAnalysis(blob);

    if (!analysis) {
      return false;
    }

    const embedding = await computeDiagnosisEmbedding(analysis);
    await retryPhotoAnalysis(plantId, photo.id, analysis, embedding);
    await applyCarePassport(plantId, analysis.carePassport);
    return true;
  };

  return { retry, loading, error: imageError ?? analysisError };
}
