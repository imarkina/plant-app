import { useState } from 'react';
import { getEmbedding } from '../model/embedding.service';
import { search } from '../model/similarity';
import type { PlantEmbedding, SearchResult } from '../model/search.types';

const SEARCH_FAILED_MESSAGE = 'Не удалось выполнить поиск';

export function usePlantSearch(plantEmbeddings: PlantEmbedding[]) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryEmbedding = await getEmbedding(query);
      const found = search(queryEmbedding, plantEmbeddings);
      setResults(found);
    } catch {
      setError(SEARCH_FAILED_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, runSearch };
}
