import React from 'react';
import { useLocations } from '../hooks/useLocations';
import { LocationsContext } from './LocationsContext';

export const LocationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { sites, locations, loading, createSite, createLocation, removeLocation } = useLocations();

  return (
    <LocationsContext.Provider
      value={{ sites, locations, loading, createSite, createLocation, removeLocation }}
    >
      {children}
    </LocationsContext.Provider>
  );
};
