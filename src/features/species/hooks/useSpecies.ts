import { useEffect, useState } from 'react';
import type { Species } from '../models/species.types';
import { speciesRepository } from '../models/species.repository';

export function useSpecies() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const loadedSpecies = await speciesRepository.getAll();
        setSpecies(loadedSpecies);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return { species, loading };
}
