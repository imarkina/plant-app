import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_PLANT_NAME, type PhotoEntry, type Plant, type PlantProfileUpdate } from '../models/plant.types';
import type { PlantReport } from '../models/plant-report.types';
import { plantsRepository } from '../models/plant.repository';

export const plantsQueryKey = ['plants'] as const;

export function usePlants() {
  const queryClient = useQueryClient();

  const plantsQuery = useQuery({
    queryKey: plantsQueryKey,
    queryFn: () => plantsRepository.getAll(),
  });

  const plants = plantsQuery.data ?? [];

  /**
   * Каждая мутация уже знает, что именно изменилось (мы сами составляли payload),
   * поэтому чиним список растений в кэше на месте — вместо повторного getAll(),
   * который перекачивал бы фото и AI-анализ вообще всей коллекции ради одного поля.
   */
  const patchPlants = (updater: (plants: Plant[]) => Plant[]) => {
    queryClient.setQueryData<Plant[]>(plantsQueryKey, (current) => updater(current ?? []));
  };

  const addPlantMutation = useMutation({
    mutationFn: (plant: Plant) => plantsRepository.save(plant),
    onSuccess: (savedPlant) => {
      patchPlants((current) => [...current, savedPlant]);
    },
  });

  const addPhotoMutation = useMutation({
    mutationFn: async ({ plantId, photo }: { plantId: string; photo: PhotoEntry }) => ({
      plantId,
      savedPhoto: await plantsRepository.addPhoto(plantId, photo),
    }),
    onSuccess: ({ plantId, savedPhoto }) => {
      patchPlants((current) =>
        current.map((plant) =>
          plant.id === plantId ? { ...plant, photos: [...plant.photos, savedPhoto] } : plant,
        ),
      );
    },
  });

  /** Удаляя фото-«покупку», делаем покупкой следующее по хронологии — растение всегда должно иметь одну. */
  const deletePhotoMutation = useMutation({
    mutationFn: async ({ plantId, photoId }: { plantId: string; photoId: string }) => {
      const plant = plants.find((p) => p.id === plantId);
      const deletedPhoto = plant?.photos.find((p) => p.id === photoId);

      await plantsRepository.deletePhoto(plantId, photoId);

      let reassignedPurchaseId: string | null = null;
      if (plant && deletedPhoto?.type === 'purchase') {
        const remaining = plant.photos
          .filter((p) => p.id !== photoId)
          .sort((a, b) => a.createdAt - b.createdAt);

        if (remaining.length > 0) {
          await plantsRepository.updatePhotoType(remaining[0].id, 'purchase');
          reassignedPurchaseId = remaining[0].id;
        }
      }

      return { plantId, photoId, reassignedPurchaseId };
    },
    onSuccess: ({ plantId, photoId, reassignedPurchaseId }) => {
      patchPlants((current) =>
        current.map((plant) => {
          if (plant.id !== plantId) {
            return plant;
          }

          return {
            ...plant,
            photos: plant.photos
              .filter((photo) => photo.id !== photoId)
              .map((photo) =>
                photo.id === reassignedPurchaseId ? { ...photo, type: 'purchase' } : photo,
              ),
          };
        }),
      );
    },
  });

  const setAvatarPhotoMutation = useMutation({
    mutationFn: async ({ plantId, photoId }: { plantId: string; photoId: string }) => {
      await plantsRepository.setAvatarPhoto(plantId, photoId);
      return { plantId, photoId };
    },
    onSuccess: ({ plantId, photoId }) => {
      patchPlants((current) =>
        current.map((plant) =>
          plant.id === plantId
            ? { ...plant, photos: plant.photos.map((photo) => ({ ...photo, isAvatar: photo.id === photoId })) }
            : plant,
        ),
      );
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ plantId, update }: { plantId: string; update: PlantProfileUpdate }) => {
      await plantsRepository.updateProfile(plantId, update);
      return { plantId, update };
    },
    onSuccess: ({ plantId, update }) => {
      patchPlants((current) =>
        current.map((plant) => (plant.id === plantId ? { ...plant, ...update } : plant)),
      );
    },
  });

  /**
   * Перезапуск AI-анализа для фото, у которого он не сохранился при первой
   * загрузке (сеть/лимиты/таймаут — см. usePlantReport.fetchAnalysis). Заодно
   * переименовывает растение, если оно всё ещё носит дефолтное имя, которое
   * присвоилось именно из-за того первого неудачного анализа.
   */
  const retryPhotoAnalysisMutation = useMutation({
    mutationFn: async ({
      plantId,
      photoId,
      analysis,
    }: {
      plantId: string;
      photoId: string;
      analysis: PlantReport;
    }) => {
      const plant = plants.find((p) => p.id === plantId);
      const shouldRename = plant?.name === DEFAULT_PLANT_NAME;

      await plantsRepository.updatePhotoAnalysis(photoId, analysis);
      if (shouldRename) {
        await plantsRepository.updateProfile(plantId, { name: analysis.identification.commonName });
      }

      return { plantId, photoId, analysis, renamedTo: shouldRename ? analysis.identification.commonName : null };
    },
    onSuccess: ({ plantId, photoId, analysis, renamedTo }) => {
      patchPlants((current) =>
        current.map((plant) => {
          if (plant.id !== plantId) {
            return plant;
          }

          return {
            ...plant,
            name: renamedTo ?? plant.name,
            photos: plant.photos.map((photo) => (photo.id === photoId ? { ...photo, analysis } : photo)),
          };
        }),
      );
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: async (plantId: string) => {
      await plantsRepository.deletePlant(plantId);
      return plantId;
    },
    onSuccess: (deletedPlantId) => {
      patchPlants((current) => current.filter((plant) => plant.id !== deletedPlantId));
    },
  });

  return {
    plants,
    loading: plantsQuery.isPending,
    addPlant: (plant: Plant) => addPlantMutation.mutateAsync(plant).then(() => undefined),
    addPhoto: (plantId: string, photo: PhotoEntry) =>
      addPhotoMutation.mutateAsync({ plantId, photo }).then(() => undefined),
    deletePhoto: (plantId: string, photoId: string) =>
      deletePhotoMutation.mutateAsync({ plantId, photoId }).then(() => undefined),
    setAvatarPhoto: (plantId: string, photoId: string) =>
      setAvatarPhotoMutation.mutateAsync({ plantId, photoId }).then(() => undefined),
    updateProfile: (plantId: string, update: PlantProfileUpdate) =>
      updateProfileMutation.mutateAsync({ plantId, update }).then(() => undefined),
    retryPhotoAnalysis: (plantId: string, photoId: string, analysis: PlantReport) =>
      retryPhotoAnalysisMutation.mutateAsync({ plantId, photoId, analysis }).then(() => undefined),
    deletePlant: (plantId: string) => deletePlantMutation.mutateAsync(plantId).then(() => undefined),
  };
}
