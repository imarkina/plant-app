import { supabase } from '../../../shared/supabase/client';
import { unwrap } from '../../../shared/supabase/unwrap';
import type {
  Location,
  LocationsRepository,
  LocationUpdate,
  NewLocationInput,
} from './location.types';
import { mapLocationRowToLocation, mapLocationUpdateToRow } from './location.mappers';

const LOCATIONS_TABLE = 'locations';

class SupabaseLocationsRepository implements LocationsRepository {
  async getAll(): Promise<Location[]> {
    const rows = unwrap(await supabase.from(LOCATIONS_TABLE).select('*').order('created_at'));

    return rows.map(mapLocationRowToLocation);
  }

  async getBySite(siteId: string): Promise<Location[]> {
    const rows = unwrap(
      await supabase.from(LOCATIONS_TABLE).select('*').eq('site_id', siteId).order('created_at'),
    );

    return rows.map(mapLocationRowToLocation);
  }

  async create(input: NewLocationInput): Promise<Location> {
    const location: Location = {
      id: crypto.randomUUID(),
      name: input.name,
      lightLevel: input.lightLevel ?? null,
    };

    unwrap(
      await supabase.from(LOCATIONS_TABLE).insert({
        id: location.id,
        name: location.name,
        light_level: location.lightLevel,
      }),
    );

    return location;
  }

  async update(locationId: string, changes: LocationUpdate): Promise<void> {
    const row = mapLocationUpdateToRow(changes);

    if (Object.keys(row).length === 0) {
      return;
    }

    unwrap(await supabase.from(LOCATIONS_TABLE).update(row).eq('id', locationId));
  }

  async remove(locationId: string): Promise<void> {
    unwrap(await supabase.from(LOCATIONS_TABLE).delete().eq('id', locationId));
  }
}

export const locationsRepository = new SupabaseLocationsRepository();
