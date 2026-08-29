import { supabase } from '../../../shared/supabase/client';
import type { Species, SpeciesRepository } from './species.types';
import { mapSpeciesRowToSpecies } from './species.mappers';

const SPECIES_TABLE = 'species';

/** Throws on a Supabase error, otherwise returns the (guaranteed non-null) data. */
function unwrap<T>({ data, error }: { data: T | null; error: unknown }): T {
  if (error) {
    throw error;
  }

  return data as T;
}

class SupabaseSpeciesRepository implements SpeciesRepository {
  async getAll(): Promise<Species[]> {
    const rows = unwrap(await supabase.from(SPECIES_TABLE).select('*').order('common_name'));

    return rows.map(mapSpeciesRowToSpecies);
  }
}

export const speciesRepository = new SupabaseSpeciesRepository();
