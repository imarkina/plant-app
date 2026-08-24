import { useState } from 'react';

import { imageUrlToBase64 } from '../../../shared/image/blob';
import type { PhotoEntry } from '../models/plant.types';

import type { PlantComparison } from '../models/plant-comparison.types';

export const usePlantComparison = () => {
  const [result, setResult] = useState<PlantComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (first: PhotoEntry, last: PhotoEntry) => {
    setLoading(true);
    try {
      const [imgFirst, imgLast] = await Promise.all([
        imageUrlToBase64(first.imageUrl!),
        imageUrlToBase64(last.imageUrl!),
      ]);
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64First: imgFirst,
          base64Last: imgLast,
          analysisFirst: first.analysis,
          analysisLast: last.analysis,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setError('Не удалось сравнить');
    } finally {
      setLoading(false);
    }
  };

  return { compare, result, loading, error };
};
