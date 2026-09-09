import { useState } from 'react';
import type { Plant } from '../models/plant.types';
import { useAddPhoto } from '../hooks/useAddPhoto';
import { useCareTasks } from '../../care-tasks/hooks/useCareTasks';
import { Tabs } from '../../../shared/ui/components/Tabs/Tabs';
import { PlantReportView } from './PlantReportView';
import { PlantArchiveSection } from './PlantArchiveSection';
import { PlantProfileTab } from './PlantProfileTab';
import { PlantTimelineView } from './PlantTimelineView';
import { CareTab } from '../../care-tasks';
import type { CareTask } from '../../care-tasks';

const PLANT_DETAIL_TABS = [
  { id: 'diagnosis', label: 'Диагноз' },
  { id: 'timeline', label: 'Таймлайн' },
  { id: 'care', label: 'Уход' },
  { id: 'profile', label: 'Профиль' },
];

type Props = {
  plant: Plant;
  activeTab?: string;
  onTabChange?: (id: string) => void;
};

export const PlantDetailTabs = ({ plant, activeTab: controlledTab, onTabChange }: Props) => {
  const { addPhotoFromFile } = useAddPhoto(plant.id);
  const [internalTab, setInternalTab] = useState('diagnosis');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;

  const careTasks = useCareTasks(plant.id);

  const handlePhotoSelected = async (task: CareTask, file: File) => {
    await addPhotoFromFile(file);
    await careTasks.markDone(task.id);
  };

  return (
    <>
      <Tabs tabs={PLANT_DETAIL_TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'diagnosis' && <PlantReportView analysis={plant.photos[0]?.analysis ?? null} />}
      {activeTab === 'timeline' && <PlantTimelineView plant={plant} />}
      {activeTab === 'care' && <CareTab plantId={plant.id} onPhotoSelected={handlePhotoSelected} />}
      {activeTab === 'profile' && (
        <>
          <PlantProfileTab plant={plant} />
          <PlantArchiveSection plant={plant} />
        </>
      )}
    </>
  );
};
