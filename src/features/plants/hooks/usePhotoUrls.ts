import type { Plant } from '../models/plant.types';
import { useEffect, useMemo } from 'react';

export const usePhotoUrls = (plants: Plant[]) => {
  const urls = useMemo(() => {
    const next: Record<string, string> = {};

    plants.forEach((p) => {
      const image = p.photos[0]?.image;

      if (image) {
        next[p.id] = URL.createObjectURL(image);
      }
    });

    return next;
  }, [plants]);

  useEffect(() => {
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [urls]);

  return urls;
};
