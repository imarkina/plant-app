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

  return {
    plants,
    loading,
    addPlant,
    addPhoto,
    setAvatarPhoto,
    updateProfile,
    archive,
    restore,
  };
}
