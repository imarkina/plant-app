import { useState } from 'react';
import type { Plant } from '../models/plant.types';
import { useAddPhoto } from '../hooks/useAddPhoto';
import { useCareTasks } from '../../care-tasks/hooks/useCareTasks';
import { useLocations } from '../../locations/hooks/useLocations';
import { lightLevelLabel } from '../../locations';
import { Tabs } from '../../../shared/ui/components/Tabs/Tabs';
import { PlantHero } from './PlantHero';
import { PlantOverviewTab } from './PlantOverviewTab';
import { PlantTimelineView } from './PlantTimelineView';
import { PlantSettingsTab } from './PlantSettingsTab';
import { WaterConfirmSheet } from './WaterConfirmSheet';
import { CareTab } from '../../care-tasks';
import type { CareTask } from '../../care-tasks';
import { Confetti } from '../../../shared/ui/components/Confetti/Confetti';
import { Toast } from '../../../shared/ui/components/Toast/Toast';
import { useToast } from '../../../shared/ui/hooks/useToast';

const PLANT_DETAIL_TABS = [
  { id: 'overview', label: 'Обзор' },
  { id: 'care', label: 'Уход' },
  { id: 'album', label: 'Альбом' },
  { id: 'settings', label: 'Настройки' },
];

type Props = {
  plant: Plant;
  /** Передаётся, когда компонент встроен в BottomSheet (там "назад" = закрыть лист). */
  onBack?: () => void;
  /** true, когда компонент встроен в BottomSheet — сужает bleed фото-героя под паддинг листа. */
  embedded?: boolean;
  titleId?: string;
};

export const PlantDetailTabs = ({ plant, onBack, embedded = false, titleId }: Props) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { addPhotoFromFile } = useAddPhoto(plant.id);
  const { tasks, markDone } = useCareTasks(plant.id);
  const { locations } = useLocations();
  const { message: toast, showToast } = useToast();
  const [celebrate, setCelebrate] = useState(false);
  const [waterSheetOpen, setWaterSheetOpen] = useState(false);

  const wateringTask = tasks.find((task) => task.type === 'watering') ?? null;
  const name = plant.photos[0]?.analysis?.identification.commonName ?? plant.name;
  const location = locations.find((l) => l.id === plant.locationId);

  const handlePhotoSelected = async (task: CareTask, file: File) => {
    await addPhotoFromFile(file);
    await markDone(task.id);
    setCelebrate(true);
    showToast('Отлично! Таймлайн обновлён 🌿');
  };

  const handleHeroPhoto = async (file: File) => {
    await addPhotoFromFile(file);
    setCelebrate(true);
    showToast('Отлично! Таймлайн обновлён 🌿');
  };

  const handleWaterConfirm = async () => {
    if (wateringTask) {
      await markDone(wateringTask.id);
      setCelebrate(true);
      showToast('Полито 💧');
    }
  };

  return (
    <>
      <PlantHero
        plant={plant}
        roomName={location?.name ?? null}
        lightLabel={lightLevelLabel(location?.lightLevel ?? null)}
        wateringTask={wateringTask}
        onWater={() => setWaterSheetOpen(true)}
        onPhotoSelected={(file) => void handleHeroPhoto(file)}
        onDiagnosis={() => setActiveTab('overview')}
        onOpenSettings={() => setActiveTab('settings')}
        onBack={onBack}
        bleedClassName={embedded ? '-mx-4' : '-mx-6'}
        titleId={titleId}
      />

      <Tabs tabs={PLANT_DETAIL_TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <PlantOverviewTab plant={plant} wateringTask={wateringTask} onOpenAlbum={() => setActiveTab('album')} />
      )}
      {activeTab === 'care' && <CareTab plantId={plant.id} onPhotoSelected={handlePhotoSelected} />}
      {activeTab === 'album' && (
        <div className="mt-6">
          <PlantTimelineView plant={plant} />
        </div>
      )}
      {activeTab === 'settings' && <PlantSettingsTab plant={plant} />}

      <WaterConfirmSheet
        open={waterSheetOpen}
        plantName={name}
        onClose={() => setWaterSheetOpen(false)}
        onConfirm={handleWaterConfirm}
      />
      <Confetti active={celebrate} onDone={() => setCelebrate(false)} />
      <Toast message={toast} />
    </>
  );
};
