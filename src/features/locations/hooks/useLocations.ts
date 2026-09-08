import { useEffect, useState } from 'react';
import type { Location, NewLocationInput } from '../models/location.types';
import { locationsRepository } from '../models/location.repository';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const loadedLocations = await locationsRepository.getAll();
    setLocations(loadedLocations);
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);

      try {
        await refresh();
      } finally {
        setLoading(false);
      }
    };
    void loadInitial();
  }, []);

  const createLocation = async (input: NewLocationInput): Promise<Location> => {
    const location = await locationsRepository.create(input);
    await refresh();
    return location;
  };

  const removeLocation = async (locationId: string) => {
    await locationsRepository.remove(locationId);
    await refresh();
  };

  return { locations, loading, createLocation, removeLocation };
}
