import { useState } from 'react';
import type { PlantReport } from '../models/plant-report.types';
import { blobToBase64 } from '../../../shared/image/blob';

const ANALYZE_ENDPOINT = '/api/analyze';
const ANALYSIS_FAILED_MESSAGE = 'Не удалось проанализировать фото';

interface AnalyzeResponseBody {
  result?: PlantReport;
}

export const usePlantReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (image: Blob): Promise<PlantReport | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const base64Image = await blobToBase64(image);

      const response = await fetch(ANALYZE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, mimeType: image.type }),
      });

      if (!response.ok) {
        throw new Error(ANALYSIS_FAILED_MESSAGE);
      }

      const responseBody = (await response.json()) as AnalyzeResponseBody;
      return responseBody.result;
    } catch {
      setError(ANALYSIS_FAILED_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return { fetchAnalysis, loading, error };
};
