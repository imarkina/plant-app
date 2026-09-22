import { type ChangeEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Plant } from '../models/plant.types';
import { PlantGrid } from './PlantGrid';
import { PlantListView } from './PlantListView';
import { CollectionHeader, type CollectionView } from './CollectionHeader';
import {
  ALL_ROOMS_OPTION,
  CollectionFilters,
  NO_ROOM_OPTION,
  type CollectionFiltersValue,
} from './CollectionFilters';
import { healthStatusToBucket } from '../models/report-status.mappers';
import { useLocations } from '../../locations/hooks/useLocations';
import { useCareTasksForPlants } from '../../care-tasks';
import { useAddPlant } from '../hooks/useAddPlant';
import { useReminderSettings } from '../../reminders';

type Props = {
  plants: Plant[];
};

const INITIAL_FILTERS: CollectionFiltersValue = {
  search: '',
  roomId: ALL_ROOMS_OPTION,
  status: null,
};

export const CollectionTab = ({ plants }: Props) => {
  const navigate = useNavigate();
  const { locations } = useLocations();
  const plantIds = useMemo(() => plants.map((plant) => plant.id), [plants]);
  const { tasksByPlantId } = useCareTasksForPlants(plantIds);
  const { settings: reminderSettings } = useReminderSettings();
  const [filters, setFilters] = useState<CollectionFiltersValue>(INITIAL_FILTERS);
  const [view, setView] = useState<CollectionView>('grid');
  const { addPlantFromFile, loading } = useAddPlant();

  const locationNameById = useMemo(
    () => new Map(locations.map((location) => [location.id, location.name])),
    [locations],
  );

  const attentionCount = plants.filter((plant) => {
    const status = plant.photos[0]?.analysis?.health.status;

    return status ? healthStatusToBucket(status) !== 'healthy' : false;
  }).length;

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

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const plantId = await addPlantFromFile(file);

    if (plantId) {
      void navigate(`/plant/${plantId}`);
    }
  };

  const handleSelect = (plantId: string) => {
    void navigate(`/plant/${plantId}`);
  };

  return (
    <div>
      <CollectionHeader
        plantsCount={plants.length}
        roomsCount={locations.length}
        attentionCount={attentionCount}
        view={view}
        onViewChange={setView}
        onAddPlantFile={(event) => void handleFileSelect(event)}
        addingPlant={loading}
      />
      <CollectionFilters value={filters} onChange={setFilters} rooms={locations} />
      {view === 'grid' ? (
        <PlantGrid
          plants={filteredPlants}
          locationNameById={locationNameById}
          careTasksByPlantId={tasksByPlantId}
          onSelect={handleSelect}
          photoReminderBadgesEnabled={!reminderSettings.pushEnabled}
        />
      ) : (
        <PlantListView
          plants={filteredPlants}
          locationNameById={locationNameById}
          careTasksByPlantId={tasksByPlantId}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};
