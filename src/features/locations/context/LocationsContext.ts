import { createContext } from 'react';
import type { Location, NewLocationInput } from '../models/location.types';

type LocationsContextValue = {
  locations: Location[];
  loading: boolean;
  createLocation: (input: NewLocationInput) => Promise<Location>;
  removeLocation: (locationId: string) => Promise<void>;
};

export const LocationsContext = createContext<LocationsContextValue | null>(null);
