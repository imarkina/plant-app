import { resizeImage } from '../../../shared/image/resize';
import type { PhotoEntry, Plant } from '../models/plant.types';
import { usePlantReport } from './usePlantReport';
import { usePlantsContext } from './usePlantsContext';

export function useAddPlant() {
  const { addPlant } = usePlantsContext();
  const { fetchAnalysis, loading, error } = usePlantReport();

  const addPlantFromFile = async (file: File) => {
    const resized = await resizeImage(file);
    const analysis = await fetchAnalysis(resized);

    // сохраняем растение даже если анализ упал
    const photoEntry: PhotoEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      image: resized,
      analysis,
    };

    const plant: Plant = {
      id: crypto.randomUUID(),
      name: file.name,
      photos: [photoEntry],
    };

    await addPlant(plant);

    return plant.id;
  };

  return { addPlantFromFile, loading, error };
}
