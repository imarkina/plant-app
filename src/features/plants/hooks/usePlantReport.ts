import { useState } from 'react';
import type { PlantReport } from '../models/plant-report.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const usePlantReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (formData: FormData): Promise<PlantReport | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
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

  return {
    fetchAnalysis,
    loading,
    error,
  };
};
