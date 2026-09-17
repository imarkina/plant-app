import { useState } from 'react';

import { CollectionTab } from './CollectionTab';
import { ArchivedPlantList } from './ArchivedPlantList';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { Tabs } from '../../../shared/ui/components/Tabs/Tabs';
import { PlantSearch } from '../../search';

const HOME_TABS = [
  { id: 'active', label: 'Активные' },
  { id: 'search', label: 'По симптомам' },
  { id: 'archive', label: 'Архив' },
];

function PlantForm() {
  const { plants } = usePlantsContext();
  const [activeTab, setActiveTab] = useState('active');

  const activePlants = plants.filter((plant) => !plant.isArchived);
  const archivedPlants = plants.filter((plant) => plant.isArchived);

  return (
    <div>
      <Tabs tabs={HOME_TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'active' && <CollectionTab plants={activePlants} />}
      {activeTab === 'search' && <PlantSearch plants={activePlants} />}
      {activeTab === 'archive' && <ArchivedPlantList plants={archivedPlants} />}
    </div>
  );
}

export default PlantForm;
