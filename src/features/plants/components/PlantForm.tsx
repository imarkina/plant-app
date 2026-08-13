import { type ChangeEvent, useState } from 'react';

import type { PlantReport } from '../models/plant-report.types';
import { PlantPreview } from './PlantPreview';
import { PlantReportView } from './PlantReportView';
import { PlantList } from './PlantList';
import { useAddPlant } from '../hooks/useAddPlant';
import { usePlantsContext } from '../hooks/usePlantsContext';

function PlantForm() {
  const { loading, error, addPlantFromFile } = useAddPlant();
  const { plants } = usePlantsContext();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [plantReport, setPlantReport] = useState<PlantReport | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setPlantReport(null);

    const fileList: FileList | null = event.target.files;

    if (fileList && fileList.length > 0) {
      const selectedFile: File = fileList[0];
      const objectUrl = URL.createObjectURL(selectedFile);

      setFile(selectedFile);
      setPreviewUrl(objectUrl);

      const report = await addPlantFromFile(selectedFile);

      setPlantReport(report ?? null);
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
      <PlantPreview previewUrl={previewUrl} filename={file?.name} />
      <PlantReportView error={error} loading={loading} analysis={plantReport} />
      <PlantList plants={plants} />
    </div>
  );
}

export default PlantForm;
