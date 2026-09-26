import { resizeImage } from '../../../shared/image/resize';
import { DEFAULT_PLANT_NAME, EMPTY_PLANT_PROFILE, type PhotoEntry, type Plant } from '../models/plant.types';
import { computeDiagnosisEmbedding } from '../models/search-embeddings';
import { usePlantReport } from './usePlantReport';
import { usePlantsContext } from './usePlantsContext';

export function useAddPlant() {
  const { addPlant } = usePlantsContext();
  const { fetchAnalysis, loading, error } = usePlantReport();

  const addPlantFromFile = async (file: File) => {
    const resized = await resizeImage(file);
    const analysis = await fetchAnalysis(resized);
    const embedding = analysis ? await computeDiagnosisEmbedding(analysis) : null;

    // сохраняем растение даже если анализ упал
    const photoEntry: PhotoEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      image: resized,
      analysis,
      embedding: embedding ?? undefined,
      type: 'growth',
    };

    const plant: Plant = {
      id: crypto.randomUUID(),
      // Имя файла ("IMG_2837.jpg") — плохой дефолт на случай, если распознавание не удалось.
      name: analysis?.identification.commonName ?? DEFAULT_PLANT_NAME,
      photos: [photoEntry],
      ...EMPTY_PLANT_PROFILE,
    };

    await addPlant(plant);

    return plant.id;
  };

  return { addPlantFromFile, loading, error };
}
