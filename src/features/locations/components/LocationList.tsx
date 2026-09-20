import { Trash2 } from 'lucide-react';
import { useLocationsContext } from '../hooks/useLocationsContext';
import { lightLevelLabel } from '../models/location-options';

const NO_DETAILS_LABEL = 'Параметры не указаны';

export const LocationList = () => {
  const { locations, removeLocation } = useLocationsContext();

  if (locations.length === 0) {
    return (
      <p className="mt-4 text-body-sm text-text-muted">Локаций ещё нет — добавьте первую ниже</p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-2.5">
      {locations.map((location) => {
        const details = [lightLevelLabel(location.lightLevel)]
          .filter((value): value is string => Boolean(value))
          .join(' · ');

        return (
          <div
            key={location.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150"
          >
            <div className="min-w-0">
              <p className="truncate text-h4 text-text-primary">{location.name}</p>
              <p className="mt-0.5 truncate text-body-sm text-text-muted">
                {details || NO_DETAILS_LABEL}
              </p>
            </div>
            {/* 44px круглая icon-кнопка из glass/2 (раздел 6.5) рядом с содержимым карточки. */}
            <button
              type="button"
              onClick={() => void removeLocation(location.id)}
              aria-label="Удалить локацию"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-surface-glass-border bg-[var(--color-surface-glass-2)] text-text-muted backdrop-blur-xl backdrop-saturate-150 transition-colors duration-100 hover:border-danger/25 hover:bg-danger-soft hover:text-danger"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
