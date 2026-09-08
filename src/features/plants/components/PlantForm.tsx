import { type ChangeEvent, useState } from 'react';

import { CollectionTab } from './CollectionTab';
import { ArchivedPlantList } from './ArchivedPlantList';
import { useAddPlant } from '../hooks/useAddPlant';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '../../../shared/ui/components/UploadZone/UploadZone';
import { Tabs } from '../../../shared/ui/components/Tabs/Tabs';
import { PlantSearch } from '../../search';

const HOME_TABS = [
  { id: 'active', label: 'Активные' },
  { id: 'search', label: 'Поиск' },
  { id: 'archive', label: 'Архив' },
];

function PlantForm() {
  const { loading, error, addPlantFromFile } = useAddPlant();
  const { plants } = usePlantsContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = event.target.files;

    if (fileList && fileList.length > 0) {
      const selectedFile: File = fileList[0];

      const plantId = await addPlantFromFile(selectedFile);

      if (plantId) {
        navigate(`/plant/${plantId}`);
      }
    }
  };

  const activePlants = plants.filter((plant) => !plant.isArchived);
  const archivedPlants = plants.filter((plant) => plant.isArchived);

  return (
    <div>
      <UploadZone
        onFileSelect={handleFileChange}
        loading={loading}
        title="Загрузите фото растения"
        subtitle="Определим вид, состояние и план ухода"
      />
      {error && <div>{error}</div>}
      <Tabs tabs={HOME_TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === 'active' && <CollectionTab plants={activePlants} />}
      {activeTab === 'search' && <PlantSearch plants={activePlants} />}
      {activeTab === 'archive' && <ArchivedPlantList plants={archivedPlants} />}
    </div>
  );
}

export default PlantForm;
