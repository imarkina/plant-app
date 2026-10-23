import type { Species } from './species.types';

interface SupabaseSpeciesRow {
  id: string;
  common_name: string;
  botanical_name: string | null;
}

export function mapSpeciesRowToSpecies(row: SupabaseSpeciesRow): Species {
  return {
    id: row.id,
    commonName: row.common_name,
    botanicalName: row.botanical_name,
  };
}
