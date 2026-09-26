import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import type { Plant } from '../../../plants/models/plant.types';
import { usePlantEmbeddings } from '../../hooks/usePlantEmbeddings';
import { usePlantSearch } from '../../hooks/usePlantSearch';
import { Badge } from '../../../../shared/ui/components/Badge/Badge';
import {
  confidenceToVariant,
  healthBucketToDotClassName,
  healthStatusToBucket,
} from '../../../plants/models/report-status.mappers';

type Props = {
  plants: Plant[];
};

export const PlantSearch = ({ plants }: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const plantEmbeddings = usePlantEmbeddings(plants);
  const { results, loading, error, runSearch } = usePlantSearch(plantEmbeddings);

  const handleSubmit = () => {
    setHasSearched(true);
    void runSearch(query);
  };

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
      {!error && plantEmbeddings.length > 0 && hasSearched && !loading && results.length === 0 && (
        <p className="text-body-sm text-text-muted">Ничего не нашлось.</p>
      )}

      <div className="flex flex-col gap-2">
        {results.map((result) => {
          const plant = plants.find((p) => p.id === result.plantId);
          const thumbnail = plant?.photos[0];
          const analysis = plant ? [...plant.photos].reverse().find((photo) => photo.analysis)?.analysis : undefined;
          const dotClassName = analysis?.health.status
            ? healthBucketToDotClassName(healthStatusToBucket(analysis.health.status))
            : null;
          const matchPercent = Math.round(result.score * 100);

          return (
            <button
              key={result.plantId}
              type="button"
              onClick={() => void navigate(`/plant/${result.plantId}`)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 text-left shadow-card backdrop-blur-xl backdrop-saturate-150 transition-transform duration-150 active:scale-[0.98]"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-bg-tertiary text-xl">
                {thumbnail?.imageUrl ? (
                  <img
                    src={thumbnail.imageUrl}
                    alt={result.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">🌿</div>
                )}
                {dotClassName && (
                  <span
                    className={`absolute top-1 right-1 size-2.5 rounded-full border-2 border-white ${dotClassName}`}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-text-primary">{result.name}</p>
                {analysis?.health.diagnosis && (
                  <p className="truncate text-body-sm text-text-muted">{analysis.health.diagnosis}</p>
                )}
              </div>

              <Badge variant={confidenceToVariant(matchPercent)}>{matchPercent}%</Badge>
              <ChevronRight size={18} className="shrink-0 text-text-muted" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
