import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Plant } from '../../../plants/models/plant.types';
import { usePlantEmbeddings } from '../../hooks/usePlantEmbeddings';
import { usePlantSearch } from '../../hooks/usePlantSearch';
import './PlantSearch.css';

type Props = {
  plants: Plant[];
};

export const PlantSearch = ({ plants }: Props) => {
  const [query, setQuery] = useState('');
  const { plantEmbeddings, loading: embeddingsLoading } = usePlantEmbeddings(plants);
  const { results, loading: searchLoading, error, runSearch } = usePlantSearch(plantEmbeddings);

  const loading = embeddingsLoading || searchLoading;

  const handleSubmit = () => void runSearch(query);

  return (
    <div className="plant-search">
      <div className="plant-search__field">
        <Search size={18} className="plant-search__icon" />
        <input
          className="plant-search__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
          placeholder="Например: желтеют листья от полива"
          disabled={loading}
        />
      </div>
      <button type="button" className="plant-search__btn" onClick={handleSubmit} disabled={loading}>
        {embeddingsLoading ? 'Готовим индекс...' : searchLoading ? 'Ищем...' : 'Найти'}
      </button>

      {error && <p className="plant-search__error">{error}</p>}
      {!error && plantEmbeddings.length === 0 && !embeddingsLoading && (
        <p className="plant-search__hint">Пока нечего искать — добавьте растения с диагнозом.</p>
      )}

      <div className="plant-search__results">
        {results.map((result) => (
          <div key={result.plantId} className="plant-search__result">
            <span className="plant-search__name">{result.name}</span>
            <span className="plant-search__score">{(result.score * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
