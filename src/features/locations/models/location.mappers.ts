import type { LightLevel, Location, LocationUpdate, Site, WindowDirection } from './location.types';

interface SupabaseSiteRow {
  id: string;
  name: string;
}

interface SupabaseLocationRow {
  id: string;
  site_id: string;
  name: string;
  window_direction: WindowDirection | null;
  distance_from_window_cm: number | null;
  light_level: LightLevel | null;
  has_grow_light: boolean;
}

export function mapSiteRowToSite(row: SupabaseSiteRow): Site {
  return { id: row.id, name: row.name };
}

export function mapLocationRowToLocation(row: SupabaseLocationRow): Location {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    windowDirection: row.window_direction,
    distanceFromWindowCm: row.distance_from_window_cm,
    lightLevel: row.light_level,
    hasGrowLight: row.has_grow_light,
  };
}

/** Builds a partial Supabase update payload, touching only the fields that were actually passed. */
export function mapLocationUpdateToRow(changes: LocationUpdate): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (changes.name !== undefined) row.name = changes.name;
  if (changes.windowDirection !== undefined) row.window_direction = changes.windowDirection;
  if (changes.distanceFromWindowCm !== undefined) {
    row.distance_from_window_cm = changes.distanceFromWindowCm;
  }
  if (changes.lightLevel !== undefined) row.light_level = changes.lightLevel;
  if (changes.hasGrowLight !== undefined) row.has_grow_light = changes.hasGrowLight;

  return row;
}
