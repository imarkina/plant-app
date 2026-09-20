import type { PhotoEntry } from '../models/plant.types';
import { usePlantComparison } from '../hooks/usePlantComparison';
import { getComparisonTrendMeta } from '../models/plant-comparison.mappers';
import { useState } from 'react';
import { AdjustmentCard } from '../../../shared/ui/components/AdjustmentCard/AdjustmentCard';
import { AlertTriangle, ChevronDown, CircleCheck, Eye } from 'lucide-react';
import { DetailRow } from '../../../shared/ui/components/DetailedRow/DetailedRow';

type Props = {
  first: PhotoEntry;
  last: PhotoEntry;
};

const TREND_CLASSES: Record<'positive' | 'negative' | 'neutral', string> = {
  positive: 'bg-brand-lime/15 text-brand-lime',
  negative: 'bg-danger-soft text-danger',
  neutral: 'bg-bg-tertiary text-text-muted',
};

const isNoActionNeeded = (items: string[]): boolean => {
  if (items.length !== 1) return false;
  const text = items[0].toLowerCase();
  return text.includes('не требуется') || text.includes('не нужно') || text.includes('оптимальн');
};

export const PlantComparison = ({ first, last }: Props) => {
  const { compare, result, loading, error } = usePlantComparison();
  const [showDetails, setShowDetails] = useState(false);

  const handleCompare = () => compare(first, last);

  return (
    <div className="mb-6">
      {!result && (
        <button
          type="button"
          onClick={() => void handleCompare()}
          disabled={loading}
          className="w-full cursor-pointer rounded-2xl bg-brand px-4 py-3 text-body font-sans font-bold text-white shadow-fab disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Анализируем динамику...' : 'Оценить динамику'}
        </button>
      )}

      {error && <p className="my-2 text-center text-body-sm text-danger">{error}</p>}

      {result && (
        <div className="flex flex-col gap-5 rounded-3xl border border-surface-glass-border bg-surface-glass p-5 shadow-card backdrop-blur-xl backdrop-saturate-150">
          {/* Вердикт с меткой тренда */}
          {(() => {
            const { Icon, label, variant } = getComparisonTrendMeta(result.summary.status);
            return (
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full ${TREND_CLASSES[variant]}`}
                >
                  <Icon size={20} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-caption text-text-muted">{label}</p>
                  <p className="mt-0.5 font-semibold text-text-primary">{result.summary.headline}</p>
                </div>
              </div>
            );
          })()}

          {/* Корректировки — карточки */}
          <div className="flex flex-col gap-2">
            {result.carePlanAdjustments.keepDoing.length > 0 && (
              <AdjustmentCard
                variant="keep"
                icon={<CircleCheck size={16} />}
                title="Продолжать"
                items={result.carePlanAdjustments.keepDoing}
              />
            )}
            {result.carePlanAdjustments.urgentChanges.length > 0 &&
              !isNoActionNeeded(result.carePlanAdjustments.urgentChanges) && (
                <AdjustmentCard
                  variant="urgent"
                  icon={<AlertTriangle size={16} />}
                  title="Срочно изменить"
                  items={result.carePlanAdjustments.urgentChanges}
                />
              )}
            {result.carePlanAdjustments.watchPoints.length > 0 && (
              <AdjustmentCard
                variant="watch"
                icon={<Eye size={16} />}
                title="Держать на контроле"
                items={result.carePlanAdjustments.watchPoints}
              />
            )}
          </div>

          {/* Детальный разбор — под спойлером */}
          <div className="border-t border-surface-glass-border pt-3">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className="flex w-full cursor-pointer items-center justify-between bg-transparent text-body-sm font-semibold text-text-muted"
            >
              Подробный разбор
              <ChevronDown
                size={18}
                className={`text-text-muted transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
              />
            </button>

            {showDetails && (
              <div className="mt-3 flex flex-col gap-3">
                <DetailRow title="Листья и побеги" text={result.detailedAnalysis.foliageAndShoots} />
                <DetailRow title="Проблемные зоны" text={result.detailedAnalysis.problemAreas} />
                <DetailRow title="Общий вид" text={result.detailedAnalysis.overallHabit} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
