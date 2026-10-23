import { useQuery } from '@tanstack/react-query';
import { speciesRepository } from '../models/species.repository';

export function useSpecies() {
  const query = useQuery({
    queryKey: ['species'],
    queryFn: () => speciesRepository.getAll(),
  });

  return { species: query.data ?? [], loading: query.isPending };
}
