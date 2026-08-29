import { useEffect, useState } from 'react';
import type { PhotoEntry, Plant } from '../models/plant.types';
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
      await refreshPlants();
      setLoading(false);
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

  return { plants, addPlant, loading, addPhoto };
}
