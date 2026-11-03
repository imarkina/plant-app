import { supabase } from '../../../shared/supabase/client';
import { unwrap } from '../../../shared/supabase/unwrap';
import type { Species, SpeciesRepository } from './species.types';
import { mapSpeciesRowToSpecies } from './species.mappers';

const SPECIES_TABLE = 'species';

class SupabaseSpeciesRepository implements SpeciesRepository {
  async getAll(): Promise<Species[]> {
    const rows = unwrap(await supabase.from(SPECIES_TABLE).select('*').order('common_name'));

    return rows.map(mapSpeciesRowToSpecies);
  }
}

export const speciesRepository = new SupabaseSpeciesRepository();
