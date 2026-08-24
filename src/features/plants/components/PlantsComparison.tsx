import type { PhotoEntry } from '../models/plant.types';
import { usePlantComparison } from '../hooks/usePlantComparison';
import './PlantsComparison.css';
import { trendMeta } from '../models/plant.mappers';
import { useState } from 'react';
import { AdjustmentCard } from '../../../shared/ui/components/AdjustmentCard/AdjustmentCard';
import { AlertTriangle, ChevronDown, CircleCheck, Eye } from 'lucide-react';
import { DetailRow } from '../../../shared/ui/components/DetailedRow/DetailedRow';

type Props = {
  photos: PhotoEntry[];
};

const isNoActionNeeded = (items: string[]): boolean => {
  if (items.length !== 1) return false;
  const text = items[0].toLowerCase();
  return text.includes('не требуется') || text.includes('не нужно') || text.includes('оптимальн');
};

export const PlantComparison = ({ photos }: Props) => {
  const { compare, result, loading, error } = usePlantComparison();
  const [showDetails, setShowDetails] = useState(false);

  if (photos.length < 2) return null;

  const first = photos[0];
  const last = photos[photos.length - 1];

  const handleCompare = () => compare(first, last);

  return (
    <div className="comparison">
      {!result && (
        <button onClick={handleCompare} disabled={loading} className="comparison__btn">
          {loading ? 'Анализируем динамику...' : 'Оценить динамику'}
        </button>
      )}

      {error && <p className="comparison__error">{error}</p>}

      {result && (
        <div className="comparison__card">
          {/* Вердикт с меткой тренда */}
          {(() => {
            const { Icon, label, variant } = trendMeta(result.summary.status);
            return (
              <div className="comparison__summary">
                <span className={`comparison__trend comparison__trend--${variant}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="comparison__trend-label">{label}</p>
                  <p className="comparison__headline">{result.summary.headline}</p>
                </div>
              </div>
            );
          })()}

          {/* Корректировки — карточки */}
          <div className="comparison__actions">
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
          <div className="comparison__details-section">
            <button
              className="comparison__toggle"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
            >
              Подробный разбор
              <ChevronDown
                size={18}
                className={`comparison__chevron ${showDetails ? 'comparison__chevron--open' : ''}`}
              />
            </button>

            {showDetails && (
              <div className="comparison__details">
                <DetailRow
                  title="Листья и побеги"
                  text={result.detailedAnalysis.foliageAndShoots}
                />
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
