import type { LightLevel, Location, LocationUpdate } from './location.types';

export interface SupabaseLocationRow {
  id: string;
  name: string;
  light_level: LightLevel | null;
}

interface SupabaseLocationUpdateRow {
  name?: string;
  light_level?: LightLevel | null;
}

export function mapLocationRowToLocation(row: SupabaseLocationRow): Location {
  return {
    id: row.id,
    name: row.name,
    lightLevel: row.light_level,
  };
}

export function mapLocationUpdateToRow(changes: LocationUpdate): SupabaseLocationUpdateRow {
  const row: SupabaseLocationUpdateRow = {};

  if (changes.name !== undefined) row.name = changes.name;
  if (changes.lightLevel !== undefined) row.light_level = changes.lightLevel;

  return row;
}
