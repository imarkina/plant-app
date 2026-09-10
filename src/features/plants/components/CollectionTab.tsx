import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import type { Plant } from '../models/plant.types';
import { PlantGrid } from './PlantGrid';
import { PlantListView } from './PlantListView';
import { PlantBottomSheet } from './PlantBottomSheet';
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
import { FAB } from '../../../shared/ui/components/FAB/FAB';

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
  const { settings: reminderSettings } = useReminderSettings();
  const [filters, setFilters] = useState<CollectionFiltersValue>(INITIAL_FILTERS);
  const [view, setView] = useState<CollectionView>('grid');
  const { addPlantFromFile, loading } = useAddPlant();

  const [openPlantId, setOpenPlantId] = useState<string | null>(null);
  const [lastOpenPlant, setLastOpenPlant] = useState<Plant | null>(null);

  useEffect(() => {
    const found = plants.find((plant) => plant.id === openPlantId);

    if (found) {
      queueMicrotask(() => setLastOpenPlant(found));
    }
  }, [openPlantId, plants]);

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
      setOpenPlantId(plantId);
    }
  };

  return (
    <div>
      <CollectionHeader
        plantsCount={plants.length}
        roomsCount={locations.length}
        attentionCount={attentionCount}
        view={view}
        onViewChange={setView}
      />
      <CollectionFilters value={filters} onChange={setFilters} rooms={locations} />
      {view === 'grid' ? (
        <PlantGrid
          plants={filteredPlants}
          locationNameById={locationNameById}
          careTasksByPlantId={tasksByPlantId}
          onSelect={setOpenPlantId}
          photoReminderBadgesEnabled={!reminderSettings.pushEnabled}
        />
      ) : (
        <PlantListView
          plants={filteredPlants}
          locationNameById={locationNameById}
          careTasksByPlantId={tasksByPlantId}
          onSelect={setOpenPlantId}
        />
      )}
      <FAB onFileSelect={handleFileSelect} loading={loading} />

      {lastOpenPlant && (
        <PlantBottomSheet
          plant={lastOpenPlant}
          open={openPlantId !== null}
          onClose={() => setOpenPlantId(null)}
        />
      )}
    </div>
  );
};
