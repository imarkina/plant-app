import { useEffect, useState } from 'react';
import type { Location, NewLocationInput, Site } from '../models/location.types';
import { locationsRepository, sitesRepository } from '../models/location.repository';

export function useLocations() {
  const [sites, setSites] = useState<Site[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const [loadedSites, loadedLocations] = await Promise.all([
      sitesRepository.getAll(),
      locationsRepository.getAll(),
    ]);
    setSites(loadedSites);
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

  const createSite = async (name: string): Promise<Site> => {
    const site = await sitesRepository.create({ name });
    await refresh();
    return site;
  };

  const createLocation = async (input: NewLocationInput): Promise<Location> => {
    const location = await locationsRepository.create(input);
    await refresh();
    return location;
  };

  const removeLocation = async (locationId: string) => {
    await locationsRepository.remove(locationId);
    await refresh();
  };

  return { sites, locations, loading, createSite, createLocation, removeLocation };
}
