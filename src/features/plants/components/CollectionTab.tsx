import { useMemo, useState } from 'react';
import type { Plant } from '../models/plant.types';
import { PlantGrid } from './PlantGrid';
import {
  ALL_ROOMS_OPTION,
  CollectionFilters,
  NO_ROOM_OPTION,
  type CollectionFiltersValue,
} from './CollectionFilters';
import { healthStatusToBucket } from '../models/report-status.mappers';
import { useLocations } from '../../locations/hooks/useLocations';
import { useCareTasksForPlants } from '../../care-tasks';

type Props = {
  plants: Plant[];
};

const INITIAL_FILTERS: CollectionFiltersValue = {
  search: '',
  roomId: ALL_ROOMS_OPTION,
  status: null,
};

export const CollectionTab = ({ plants }: Props) => {
  const { locations } = useLocations();
  const plantIds = useMemo(() => plants.map((plant) => plant.id), [plants]);
  const { tasksByPlantId } = useCareTasksForPlants(plantIds);
  const [filters, setFilters] = useState<CollectionFiltersValue>(INITIAL_FILTERS);

  const locationNameById = useMemo(
    () => new Map(locations.map((location) => [location.id, location.name])),
    [locations],
  );

  const filteredPlants = plants.filter((plant) => {
    const analysis = plant.photos[0]?.analysis;
    const name = analysis?.identification.commonName ?? plant.name;
    const search = filters.search.trim().toLowerCase();

    if (search && !name.toLowerCase().includes(search)) {
      return false;
    }

    if (filters.roomId === NO_ROOM_OPTION && plant.locationId) {
      return false;
    }

    if (
      filters.roomId !== ALL_ROOMS_OPTION &&
      filters.roomId !== NO_ROOM_OPTION &&
      plant.locationId !== filters.roomId
    ) {
      return false;
    }

    if (filters.status) {
      const status = analysis?.health.status;

      if (!status || healthStatusToBucket(status) !== filters.status) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      <CollectionFilters value={filters} onChange={setFilters} rooms={locations} />
      <PlantGrid
        plants={filteredPlants}
        locationNameById={locationNameById}
        careTasksByPlantId={tasksByPlantId}
      />
    </div>
  );
};
