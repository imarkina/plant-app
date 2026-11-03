import { useContext } from 'react';
import { LocationsContext } from '../context/LocationsContext';

export const useLocationsContext = () => {
  const context = useContext(LocationsContext);

  if (!context) {
    throw new Error('context must be inside a provider');
  }

  return context;
};
