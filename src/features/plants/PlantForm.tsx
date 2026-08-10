import { type ChangeEvent, useState } from 'react';

import { resizeImage } from '../../shared/image/resize';
import type { PhotoEntry, Plant } from './plant.types';
import { usePlants } from './usePlants';
import Markdown from 'react-markdown';
import type { PlantReport } from './plant-report.types';
function PlantForm() {
  const { plants, addPlant } = usePlants();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [plantReport, setPlantReport] = useState<PlantReport | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = event.target.files;

    if (fileList && fileList.length > 0) {
      const selectedFile: File = fileList[0];

      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);

      setPreviewUrl(objectUrl);

      const resizedImage = await resizeImage(selectedFile);
      event.target.value = '';

      const formData = new FormData();
      formData.append('image', resizedImage, selectedFile.name);
      const res = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      setPlantReport(data.result);

      const photoEntry: PhotoEntry = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        image: resizedImage,
      };

      const plant: Plant = {
        id: crypto.randomUUID(),
        name: selectedFile.name,
        photos: [photoEntry],
      };

      await addPlant(plant);
    }
  };

  return (
    <div>
      <label htmlFor="plant-image">Выберите фотку</label>
      <input
        name="plant-image"
        id="plant-image"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
      {file && previewUrl && (
        <div style={{ textAlign: 'center' }}>
          <p>
            <strong>Selected File:</strong> {file.name}
          </p>
          <img
            src={previewUrl}
            alt="preview"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
      <Markdown>{plantReport && JSON.stringify(plantReport)}</Markdown>
      <ul>
        {plants.map((plant) => (
          <li key={plant.id}>
            {plant.name} — фото: {plant.photos.length}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlantForm;
