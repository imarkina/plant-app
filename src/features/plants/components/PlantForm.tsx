import { useState } from 'react';

import { CollectionTab } from './CollectionTab';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { Tabs } from '../../../shared/ui/components/Tabs/Tabs';
import { PlantSearch } from '../../search';

const HOME_TABS = [
  { id: 'active', label: 'Активные' },
  { id: 'search', label: 'По симптомам' },
];

function PlantForm() {
  const { plants } = usePlantsContext();
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div>
      <Tabs tabs={HOME_TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'active' && <CollectionTab plants={plants} />}
      {activeTab === 'search' && <PlantSearch plants={plants} />}
    </div>
  );
}

export default PlantForm;
