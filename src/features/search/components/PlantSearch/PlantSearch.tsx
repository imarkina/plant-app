import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Plant } from '../../../plants/models/plant.types';
import { usePlantEmbeddings } from '../../hooks/usePlantEmbeddings';
import { usePlantSearch } from '../../hooks/usePlantSearch';

type Props = {
  plants: Plant[];
};

export const PlantSearch = ({ plants }: Props) => {
  const [query, setQuery] = useState('');
  const plantEmbeddings = usePlantEmbeddings(plants);
  const { results, loading, error, runSearch } = usePlantSearch(plantEmbeddings);

  const handleSubmit = () => void runSearch(query);

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-surface-glass-border bg-surface-glass px-4 py-3 backdrop-blur-xl backdrop-saturate-150 shadow-card transition-shadow duration-100 focus-within:shadow-[var(--shadow-focus)]">
        <Search size={18} className="shrink-0 text-text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
          placeholder="Например: желтеют листья от полива"
          disabled={loading}
          className="flex-1 bg-transparent text-body font-sans text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="cursor-pointer rounded-2xl bg-brand px-4 py-3 text-button font-sans font-semibold text-white shadow-fab disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? 'Ищем...' : 'Найти'}
      </button>

      {error && <p className="text-body-sm text-danger">{error}</p>}
      {!error && plantEmbeddings.length === 0 && (
        <p className="text-body-sm text-text-muted">
          Пока нечего искать — добавьте растения с диагнозом.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {results.map((result) => (
          <div
            key={result.plantId}
            className="flex items-center justify-between rounded-2xl border border-surface-glass-border bg-surface-glass px-4 py-3 backdrop-blur-xl backdrop-saturate-150"
          >
            <span className="font-semibold text-text-primary">{result.name}</span>
            <span className="text-body-sm text-text-muted">{(result.score * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
