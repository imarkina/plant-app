import { useEffect, useState } from 'react';
import type { ArchiveStatus, PhotoEntry, Plant, PlantProfileUpdate } from '../models/plant.types';
import { plantsRepository } from '../models/plant.repository';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPlants = async () => {
    const updatedPlants = await plantsRepository.getAll();
    setPlants(updatedPlants);
  };

  useEffect(() => {
    const loadInitialPlants = async () => {
      setLoading(true);

      try {
        await refreshPlants();
      } finally {
        setLoading(false);
      }
    };
    void loadInitialPlants();
  }, []);

  const addPlant = async (plant: Plant) => {
    await plantsRepository.save(plant);
    await refreshPlants();
  };

  const addPhoto = async (plantId: string, photo: PhotoEntry) => {
    await plantsRepository.addPhoto(plantId, photo);
    await refreshPlants();
  };

  /** Удаляя фото-«покупку», делаем покупкой следующее по хронологии — растение всегда должно иметь одну. */
  const deletePhoto = async (plantId: string, photoId: string) => {
    const plant = plants.find((p) => p.id === plantId);
    const deletedPhoto = plant?.photos.find((p) => p.id === photoId);

    await plantsRepository.deletePhoto(plantId, photoId);

    if (plant && deletedPhoto?.type === 'purchase') {
      const remaining = plant.photos
        .filter((p) => p.id !== photoId)
        .sort((a, b) => a.createdAt - b.createdAt);

      if (remaining.length > 0) {
        await plantsRepository.updatePhotoType(remaining[0].id, 'purchase');
      }
    }

    await refreshPlants();
  };

  const setAvatarPhoto = async (plantId: string, photoId: string) => {
    await plantsRepository.setAvatarPhoto(plantId, photoId);
    await refreshPlants();
  };

  const updateProfile = async (plantId: string, update: PlantProfileUpdate) => {
    await plantsRepository.updateProfile(plantId, update);
    await refreshPlants();
  };

  const archive = async (plantId: string, status: ArchiveStatus, reasonDetail?: string | null) => {
    await plantsRepository.archive(plantId, status, reasonDetail);
    await refreshPlants();
  };

  const restore = async (plantId: string) => {
    await plantsRepository.restore(plantId);
    await refreshPlants();
  };

  const deletePlant = async (plantId: string) => {
    await plantsRepository.deletePlant(plantId);
    await refreshPlants();
  };

  return {
    plants,
    loading,
    addPlant,
    addPhoto,
    deletePhoto,
    setAvatarPhoto,
    updateProfile,
    archive,
    restore,
    deletePlant,
  };
}
