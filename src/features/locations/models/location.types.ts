export type WindowDirection = 'N' | 'S' | 'E' | 'W';
export type LightLevel = 'direct' | 'bright_indirect' | 'low_light';

export interface Site {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  siteId: string;
  name: string;
  windowDirection: WindowDirection | null;
  distanceFromWindowCm: number | null;
  lightLevel: LightLevel | null;
  hasGrowLight: boolean;
}

export interface NewSiteInput {
  name: string;
}

export interface NewLocationInput {
  siteId: string;
  name: string;
  windowDirection?: WindowDirection | null;
  distanceFromWindowCm?: number | null;
  lightLevel?: LightLevel | null;
  hasGrowLight?: boolean;
}

export type LocationUpdate = Partial<Omit<NewLocationInput, 'siteId'>>;

export interface SitesRepository {
  getAll(): Promise<Site[]>;
  create(input: NewSiteInput): Promise<Site>;
  rename(siteId: string, name: string): Promise<void>;
  remove(siteId: string): Promise<void>;
}

export interface LocationsRepository {
  getAll(): Promise<Location[]>;
  getBySite(siteId: string): Promise<Location[]>;
  create(input: NewLocationInput): Promise<Location>;
  update(locationId: string, changes: LocationUpdate): Promise<void>;
  remove(locationId: string): Promise<void>;
}
