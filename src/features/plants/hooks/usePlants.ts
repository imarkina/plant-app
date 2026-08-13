import { useEffect, useState } from 'react';
import type { Plant } from '../models/plant.types';
import { plantsRepository } from '../models/plant.repository';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const load = async () => {
      const saved = await plantsRepository.getAll();
      setPlants(saved);
    };

    void load();
  }, []);

  const addPlant = async (plant: Plant) => {
    await plantsRepository.save(plant);
    const updatedPlants = await plantsRepository.getAll();
    setPlants(updatedPlants);
  };

  return { plants, addPlant };
}
