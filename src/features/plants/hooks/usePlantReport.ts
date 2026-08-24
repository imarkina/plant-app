import { useState } from 'react';
import type { PlantReport } from '../models/plant-report.types';
import { blobToBase64 } from '../../../shared/image/blob';

export const usePlantReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (image: Blob): Promise<PlantReport | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const base64 = await blobToBase64(image);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: image.type }),
      });

      if (!res.ok) {
        throw new Error('Не удалось проанализировать фото');
      }

      const data = await res.json();
      return data.result;
    } catch (e) {
      setError('Не удалось проанализировать фото');
    } finally {
      setLoading(false);
    }
  };

  return { fetchAnalysis, loading, error };
};
