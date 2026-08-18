import { type ChangeEvent } from 'react';

import { PlantList } from './PlantList';
import { useAddPlant } from '../hooks/useAddPlant';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useNavigate } from 'react-router-dom';
import { UploadZone } from '../../../shared/ui/components/UploadZone/UploadZone';

function PlantForm() {
  const { loading, error, addPlantFromFile } = useAddPlant();
  const { plants } = usePlantsContext();
  const navigate = useNavigate();

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

  return (
    <div>
      <UploadZone onFileSelect={handleFileChange} loading={loading} />
      {error && <div>{error}</div>}
      <PlantList plants={plants} />
    </div>
  );
}

export default PlantForm;
