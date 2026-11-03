import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Location, NewLocationInput } from '../models/location.types';
import { locationsRepository } from '../models/location.repository';

export const locationsQueryKey = ['locations'] as const;

/**
 * useLocations() дергается напрямую (без контекста) сразу из шести мест —
 * ProfilePage, PlantSettingsTab, CollectionTab, PlantDetailTabs,
 * PlantProfileTab — и при старом useState/useEffect каждое такое место было
 * отдельным GET-запросом к /locations, даже если несколько из них монтируются
 * одновременно (например, PlantDetailTabs + вложенный в него PlantSettingsTab).
 * Общий ключ кэша схлопывает это в один запрос на всё приложение.
 */
export function useLocations() {
  const queryClient = useQueryClient();

  const locationsQuery = useQuery({
    queryKey: locationsQueryKey,
    queryFn: () => locationsRepository.getAll(),
  });

  const locations = locationsQuery.data ?? [];

  const patchLocations = (updater: (locations: Location[]) => Location[]) => {
    queryClient.setQueryData<Location[]>(locationsQueryKey, (current) => updater(current ?? []));
  };

  const createMutation = useMutation({
    mutationFn: (input: NewLocationInput) => locationsRepository.create(input),
    onSuccess: (location) => {
      patchLocations((current) => [...current, location]);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (locationId: string) => {
      await locationsRepository.remove(locationId);
      return locationId;
    },
    onSuccess: (locationId) => {
      patchLocations((current) => current.filter((location) => location.id !== locationId));
    },
  });

  return {
    locations,
    loading: locationsQuery.isPending,
    createLocation: (input: NewLocationInput) => createMutation.mutateAsync(input),
    removeLocation: (locationId: string) => removeMutation.mutateAsync(locationId).then(() => undefined),
  };
}
