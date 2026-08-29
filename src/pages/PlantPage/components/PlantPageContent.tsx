import type { Plant } from '../../../features/plants/models/plant.types';
import { useAddPhoto } from '../../../features/plants/hooks/useAddPhoto';
import { useCareTasks } from '../../../features/care-tasks/hooks/useCareTasks';
import { BackButton } from '../../../shared/ui/components/BackButton/BackButton';
import { PlantPreview } from '../../../features/plants/components/PlantPreview';
import { Tabs } from '../../../shared/ui/components/Tabs/Tabs';
import { PlantReportView } from '../../../features/plants/components/PlantReportView';
import { PlantArchiveSection, PlantProfileTab, PlantTimelineView } from '../../../features/plants';
import { CareTab } from '../../../features/care-tasks';
import type { CareTask } from '../../../features/care-tasks/models/care-tasks.model';
import { useState } from 'react';

const tabs = [
  { id: 'diagnosis', label: 'Диагноз' },
  { id: 'timeline', label: 'Таймлайн' },
  { id: 'care', label: 'Уход' },
  { id: 'profile', label: 'Профиль' },
];

type Props = {
  plant: Plant;
};

export const PlantPageContent = ({ plant }: Props) => {
  const { addPhotoFromFile } = useAddPhoto(plant.id);

  const [activeTab, setActiveTab] = useState('diagnosis');

  const careTasks = useCareTasks(plant.id);

  const handlePhotoSelected = async (task: CareTask, file: File) => {
    await addPhotoFromFile(file);
    await careTasks.markDone(task.id);
  };

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <BackButton />
      {plant.photos[0].imageUrl && <PlantPreview previewUrl={plant.photos[0].imageUrl} />}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'diagnosis' && <PlantReportView analysis={plant.photos[0].analysis ?? null} />}
      {activeTab === 'timeline' && <PlantTimelineView plant={plant} />}
      {activeTab === 'care' && <CareTab plantId={plant.id} onPhotoSelected={handlePhotoSelected} />}
      {activeTab === 'profile' && (
        <>
          <PlantProfileTab plant={plant} />
          <PlantArchiveSection plant={plant} />
        </>
      )}
    </div>
  );
};
