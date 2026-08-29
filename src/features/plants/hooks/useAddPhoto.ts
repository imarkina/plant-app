import type { PhotoEntry } from '../models/plant.types';
import { resizeImage } from '../../../shared/image/resize';
import { usePlantsContext } from './usePlantsContext';
import { usePlantReport } from './usePlantReport';

export function useAddPhoto(plantId: string) {
  const { addPhoto } = usePlantsContext();
  const { fetchAnalysis, loading, error } = usePlantReport();

  const addPhotoFromFile = async (file: File) => {
    const resized = await resizeImage(file);
    const analysis = await fetchAnalysis(resized); // тот же анализ, что на главной

    const photo: PhotoEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      image: resized,
      analysis,
    };

    await addPhoto(plantId, photo); // дописать к растению
  };

  return { addPhotoFromFile, loading, error };
}
