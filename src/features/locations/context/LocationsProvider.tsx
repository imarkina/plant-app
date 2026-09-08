import React from 'react';
import { useLocations } from '../hooks/useLocations';
import { LocationsContext } from './LocationsContext';

export const LocationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { locations, loading, createLocation, removeLocation } = useLocations();

  return (
    <LocationsContext.Provider
      value={{ locations, loading, createLocation, removeLocation }}
    >
      {children}
    </LocationsContext.Provider>
  );
};
