import type { PlantEmbedding, SearchResult } from './search.types';

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let sumSquaresA = 0;
  let sumSquaresB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    sumSquaresA += a[i] * a[i];
    sumSquaresB += b[i] * b[i];
  }

  const normA = Math.sqrt(sumSquaresA);
  const normB = Math.sqrt(sumSquaresB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (normA * normB);
}

export function search(queryEmbedding: number[], plants: PlantEmbedding[]): SearchResult[] {
  const results: SearchResult[] = plants.map((plant) => ({
    plantId: plant.plantId,
    name: plant.name,
    score: cosineSimilarity(queryEmbedding, plant.embedding),
  }));

  return results.sort((a, b) => b.score - a.score);
}
