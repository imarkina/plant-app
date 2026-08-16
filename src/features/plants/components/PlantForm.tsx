import { type ChangeEvent } from 'react';

import { PlantList } from './PlantList';
import { useAddPlant } from '../hooks/useAddPlant';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useNavigate } from 'react-router-dom';

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
      <label htmlFor="plant-image">Выберите изображение:</label>
      <input
        name="plant-image"
        id="plant-image"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
      {loading && <div>Анализируем...</div>}
      {error && <div>{error}</div>}
      <PlantList plants={plants} />
    </div>
  );
}

export default PlantForm;
