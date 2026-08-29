import { supabase } from '../../../shared/supabase/client';
import type {
  Location,
  LocationsRepository,
  LocationUpdate,
  NewLocationInput,
  NewSiteInput,
  Site,
  SitesRepository,
} from './location.types';
import {
  mapLocationRowToLocation,
  mapLocationUpdateToRow,
  mapSiteRowToSite,
} from './location.mappers';

const SITES_TABLE = 'sites';
const LOCATIONS_TABLE = 'locations';

/** Throws on a Supabase error, otherwise returns the (guaranteed non-null) data. */
function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) {
    throw error;
  }

  return data as T;
}

class SupabaseSitesRepository implements SitesRepository {
  async getAll(): Promise<Site[]> {
    const rows = unwrap(await supabase.from(SITES_TABLE).select('*').order('created_at'));

    return rows.map(mapSiteRowToSite);
  }

  async create(input: NewSiteInput): Promise<Site> {
    const site: Site = { id: crypto.randomUUID(), name: input.name };

    unwrap(await supabase.from(SITES_TABLE).insert({ id: site.id, name: site.name }));

    return site;
  }

  async rename(siteId: string, name: string): Promise<void> {
    unwrap(await supabase.from(SITES_TABLE).update({ name }).eq('id', siteId));
  }

  async remove(siteId: string): Promise<void> {
    unwrap(await supabase.from(SITES_TABLE).delete().eq('id', siteId));
  }
}

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
      siteId: input.siteId,
      name: input.name,
      windowDirection: input.windowDirection ?? null,
      distanceFromWindowCm: input.distanceFromWindowCm ?? null,
      lightLevel: input.lightLevel ?? null,
      hasGrowLight: input.hasGrowLight ?? false,
    };

    unwrap(
      await supabase.from(LOCATIONS_TABLE).insert({
        id: location.id,
        site_id: location.siteId,
        name: location.name,
        window_direction: location.windowDirection,
        distance_from_window_cm: location.distanceFromWindowCm,
        light_level: location.lightLevel,
        has_grow_light: location.hasGrowLight,
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

export const sitesRepository = new SupabaseSitesRepository();
export const locationsRepository = new SupabaseLocationsRepository();
