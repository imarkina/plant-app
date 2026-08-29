import { createContext } from 'react';
import type { Location, NewLocationInput, Site } from '../models/location.types';

type LocationsContextValue = {
  sites: Site[];
  locations: Location[];
  loading: boolean;
  createSite: (name: string) => Promise<Site>;
  createLocation: (input: NewLocationInput) => Promise<Location>;
  removeLocation: (locationId: string) => Promise<void>;
};

export const LocationsContext = createContext<LocationsContextValue | null>(null);
