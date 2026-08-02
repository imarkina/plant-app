import { type ChangeEvent, useState } from 'react';

import './App.css';
import { resizeImage } from '../../shared/image/resize';

function PlantForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = event.target.files;

    if (fileList && fileList.length > 0) {
      const selectedFile: File = fileList[0];

      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);

      setPreviewUrl(objectUrl);

      const resizedImage = await resizeImage(selectedFile);
      console.log('size', resizedImage.size);
      event.target.value = '';
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
    </div>
  );
}

export default PlantForm;
