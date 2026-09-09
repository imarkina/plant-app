import type { PhotoEntry, PhotoType } from '../models/plant.types';
import { resizeImage } from '../../../shared/image/resize';
import { usePlantsContext } from './usePlantsContext';
import { usePlantReport } from './usePlantReport';

export function useAddPhoto(plantId: string) {
  const { addPhoto } = usePlantsContext();
  const { fetchAnalysis, loading, error } = usePlantReport();

  const addPhotoFromFile = async (
    file: Blob,
    options?: { type?: PhotoType; maxSize?: number; note?: string },
  ) => {
    const resized = await resizeImage(file, options?.maxSize);
    const analysis = await fetchAnalysis(resized); // тот же анализ, что на главной

    const photo: PhotoEntry = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      image: resized,
      analysis,
      type: options?.type ?? 'growth',
      note: options?.note,
    };

    await addPhoto(plantId, photo); // дописать к растению
  };

  return { addPhotoFromFile, loading, error };
}
