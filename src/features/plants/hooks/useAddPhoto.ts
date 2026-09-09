import type { PhotoEntry, PhotoType } from '../models/plant.types';
import { resizeImage } from '../../../shared/image/resize';
import { usePlantsContext } from './usePlantsContext';
import { usePlantReport } from './usePlantReport';

export function useAddPhoto(plantId: string) {
  const { addPhoto } = usePlantsContext();
  const { fetchAnalysis, loading, error } = usePlantReport();

  const addPhotoFromFile = async (file: Blob, type: PhotoType = 'growth', maxSize?: number) => {
    const resized = await resizeImage(file, maxSize);
    const analysis = await fetchAnalysis(resized); // тот же анализ, что на главной

    const photo: PhotoEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      image: resized,
      analysis,
      type,
    };

    await addPhoto(plantId, photo); // дописать к растению
  };

  return { addPhotoFromFile, loading, error };
}
