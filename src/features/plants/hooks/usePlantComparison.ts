import { useState } from 'react';

import { imageUrlToBase64 } from '../../../shared/image/blob';
import type { PhotoEntry } from '../models/plant.types';

import type { PlantComparison } from '../models/plant-comparison.types';

const COMPARE_ENDPOINT = '/api/compare';
const COMPARE_IMAGE_MIME_TYPE = 'image/jpeg';
const COMPARISON_FAILED_MESSAGE = 'Не удалось сравнить';

interface CompareResponseBody {
  result: PlantComparison;
}

export const usePlantComparison = () => {
  const [result, setResult] = useState<PlantComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async (first: PhotoEntry, last: PhotoEntry) => {
    setLoading(true);
    try {
      const [firstImageBase64, lastImageBase64] = await Promise.all([
        imageUrlToBase64(first.imageUrl!),
        imageUrlToBase64(last.imageUrl!),
      ]);
      const response = await fetch(COMPARE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64First: firstImageBase64,
          base64Last: lastImageBase64,
          analysisFirst: first.analysis,
          analysisLast: last.analysis,
          mimeType: COMPARE_IMAGE_MIME_TYPE,
        }),
      });
      const responseBody = (await response.json()) as CompareResponseBody;
      setResult(responseBody.result);
    } catch {
      setError(COMPARISON_FAILED_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return { compare, result, loading, error };
};
