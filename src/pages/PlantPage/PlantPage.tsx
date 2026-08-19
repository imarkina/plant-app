import { useParams } from 'react-router-dom';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { PlantReportView } from '../../features/plants/components/PlantReportView';
import { PlantPreview } from '../../features/plants/components/PlantPreview';
import { useState } from 'react';
import { Tabs } from '../../shared/ui/components/Tabs/Tabs';
import { BackButton } from '../../shared/ui/components/BackButton/BackButton';

const tabs = [
  { id: 'diagnosis', label: 'Диагноз' },
  { id: 'timeline', label: 'Таймлайн' },
  { id: 'care', label: 'Уход' },
];

export const PlantPage = () => {
  const { id } = useParams();
  const { plants, loading } = usePlantsContext();

  const [activeTab, setActiveTab] = useState('diagnosis');

  const plant = plants.find((p) => p.id === id);

  if (loading) return <p>Загрузка...</p>;

  if (!plant || !plant.photos[0]) return <p>Не найдено...</p>;

  return (
    <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <BackButton />
      {plant.photos[0].imageUrl && <PlantPreview previewUrl={plant.photos[0].imageUrl} />}
      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'diagnosis' && <PlantReportView analysis={plant.photos[0].analysis ?? null} />}
      {activeTab === 'timeline' && <p>Таймлайн скоро</p>}
      {activeTab === 'care' && <p>Уход скоро</p>}
    </div>
  );
};
