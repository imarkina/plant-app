import { useEffect, useState } from 'react';

import { imageUrlToBase64 } from '../../../shared/image/blob';
import type { PhotoEntry } from '../models/plant.types';

import type { PlantComparison } from '../models/plant-comparison.types';
import { plantComparisonRepository } from '../models/plant-comparison.repository';
import { computeComparisonEmbedding } from '../models/search-embeddings';

const COMPARE_ENDPOINT = '/api/compare';
const COMPARE_IMAGE_MIME_TYPE = 'image/jpeg';
const COMPARISON_FAILED_MESSAGE = 'Не удалось сравнить';

interface CompareResponseBody {
  result: PlantComparison;
}

/** Checks for a saved comparison of this exact photo pair before offering to run a new one. */
export const usePlantComparison = (plantId: string, firstPhotoId: string, lastPhotoId: string) => {
  const pairKey = `${firstPhotoId}:${lastPhotoId}`;
  const [checkedPairKey, setCheckedPairKey] = useState<string | null>(null);
  const [result, setResult] = useState<PlantComparison | null>(null);
  const [comparedAt, setComparedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset during render (not in an effect) when the photo pair changes, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const checkingSaved = checkedPairKey !== pairKey;
  if (checkingSaved && result !== null) {
    setResult(null);
    setComparedAt(null);
  }

  useEffect(() => {
    let cancelled = false;

    void plantComparisonRepository
      .find(firstPhotoId, lastPhotoId)
      .then((saved) => {
        if (cancelled) {
          return;
        }
        if (saved) {
          setResult(saved.result);
          setComparedAt(saved.createdAt);
        }
        setCheckedPairKey(pairKey);
      });

    return () => {
      cancelled = true;
    };
  }, [pairKey, firstPhotoId, lastPhotoId]);

  const compare = async (first: PhotoEntry, last: PhotoEntry) => {
    setLoading(true);
    setError(null);
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
      const embedding = await computeComparisonEmbedding(responseBody.result);
      const saved = await plantComparisonRepository.save(
        plantId,
        first.id,
        last.id,
        responseBody.result,
        embedding,
      );
      setResult(saved.result);
      setComparedAt(saved.createdAt);
    } catch {
      setError(COMPARISON_FAILED_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return { compare, result, comparedAt, loading, checkingSaved, error };
};
