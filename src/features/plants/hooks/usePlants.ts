import { useEffect, useState } from 'react';
import type { Plant } from '../models/plant.types';
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

  return { plants, addPlant, loading };
}
