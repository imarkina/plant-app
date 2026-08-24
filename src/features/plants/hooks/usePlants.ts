import { useEffect, useState } from 'react';
import type { PhotoEntry, Plant } from '../models/plant.types';
import { plantsRepository } from '../models/plant.repository';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const saved = await plantsRepository.getAll();
      setPlants(saved);
      setLoading(false);
    };
    void load();
  }, []);

  const addPlant = async (plant: Plant) => {
    await plantsRepository.save(plant);
    const updatedPlants = await plantsRepository.getAll();
    setPlants(updatedPlants);
  };

  const addPhoto = async (plantId: string, photo: PhotoEntry) => {
    await plantsRepository.addPhoto(plantId, photo);
    const updated = await plantsRepository.getAll();
    setPlants(updated);
  };

  return { plants, addPlant, loading, addPhoto };
}
