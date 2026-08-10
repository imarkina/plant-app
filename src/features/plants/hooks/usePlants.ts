import { useEffect, useState } from 'react';
import type { Plant } from '../models/plant.types';
import { localStoragePlantsRepository } from '../models/plant.repository';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const load = async () => {
      const saved = await localStoragePlantsRepository.getAll();
      setPlants(saved);
    };

    void load();
  }, []);

  const addPlant = async (plant: Plant) => {
    await localStoragePlantsRepository.save(plant);
    const updatedPlants = await localStoragePlantsRepository.getAll();
    setPlants(updatedPlants);
  };

  return { plants, addPlant };
}
