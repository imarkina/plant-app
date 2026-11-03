export type LightLevel = 'direct' | 'bright_indirect' | 'low_light';

export interface Location {
  id: string;
  name: string; // «Кухня, подоконник»
  lightLevel: LightLevel | null;
}

export interface NewLocationInput {
  name: string;
  lightLevel?: LightLevel | null;
}

export type LocationUpdate = Partial<NewLocationInput>;

export interface LocationsRepository {
  getAll(): Promise<Location[]>;
  create(input: NewLocationInput): Promise<Location>;
  update(locationId: string, changes: LocationUpdate): Promise<void>;
  remove(locationId: string): Promise<void>;
}
