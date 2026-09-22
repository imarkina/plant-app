import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PhotoEntry, Plant, PlantProfileUpdate } from '../models/plant.types';
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
    deletePlant: (plantId: string) => deletePlantMutation.mutateAsync(plantId).then(() => undefined),
  };
}
