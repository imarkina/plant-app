import { Fragment } from 'react';
import { ZoomIn } from 'lucide-react';
import type { PhotoEntry } from '../models/plant.types';
import { healthBucketToLabel, healthStatusToBucket } from '../models/report-status.mappers';
import { PHOTO_TYPE_ICON, PHOTO_TYPE_LABEL } from '../models/photo-type-labels';
import { pluralizeRu } from '../../../shared/helpers';

const DAY_MS = 24 * 60 * 60 * 1000;
const GAP_DIVIDER_THRESHOLD_DAYS = 180;

function isSameCalendarDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function formatGrowthDelta(days: number): string {
  if (days <= 0) {
    return 'Первый день';
  }
  if (days < 30) {
    return `+${days} ${pluralizeRu(days, 'день', 'дня', 'дней')}`;
  }
  const months = Math.round(days / 30);
  return `+${months} ${pluralizeRu(months, 'месяц', 'месяца', 'месяцев')}`;
}

function formatGapLabel(days: number): string {
  const months = Math.round(days / 30);
  return `${months} ${pluralizeRu(months, 'МЕСЯЦ', 'МЕСЯЦА', 'МЕСЯЦЕВ')} БЕЗ ФОТО`;
}

function photoTags(photo: PhotoEntry): string[] {
  const tags: string[] = [];
  if (photo.type !== 'growth') {
    tags.push(PHOTO_TYPE_LABEL[photo.type]);
  }
  const status = photo.analysis?.health.status;
  if (status) {
    tags.push(healthBucketToLabel(healthStatusToBucket(status)));
  }
  return tags;
}

type Props = {
  /** Отсортированы по возрастанию даты. */
  photos: PhotoEntry[];
  onZoom: (photo: PhotoEntry) => void;
  onCompare?: (photo: PhotoEntry) => void;
};

export const PhotoTimeline = ({ photos, onZoom, onCompare }: Props) => {
  if (photos.length === 0) {
    return <p className="mt-6 text-body-sm text-text-muted">У этого растения пока нет фото.</p>;
  }

  const firstPhoto = photos[0];

  return (
    <div className="relative mt-6 pl-9">
      <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-surface-glass-border" />
      <div className="flex flex-col gap-4">
        {photos.map((photo, index) => {
          const isLast = index === photos.length - 1;
          const previous = index > 0 ? photos[index - 1] : null;
          const days = Math.round((photo.createdAt - firstPhoto.createdAt) / DAY_MS);
          const gapDays = previous ? Math.round((photo.createdAt - previous.createdAt) / DAY_MS) : 0;
          const showGapDivider = previous !== null && gapDays >= GAP_DIVIDER_THRESHOLD_DAYS;

          const sameDayAsPrevious = previous !== null && isSameCalendarDay(photo.createdAt, previous.createdAt);
          const dateLabel = sameDayAsPrevious
            ? new Date(photo.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
            : new Date(photo.createdAt)
                .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                .toUpperCase();

          const suffix = isLast
            ? 'СЕЙЧАС'
            : photo.type !== 'growth'
              ? PHOTO_TYPE_LABEL[photo.type].toUpperCase()
              : null;
          const bucket = photo.analysis?.health.status
            ? healthStatusToBucket(photo.analysis.health.status)
            : null;

          return (
            <Fragment key={photo.id}>
              {showGapDivider && (
                <div className="relative -ml-9 flex items-center gap-2 py-1 text-caption font-semibold text-text-muted">
                  <span className="h-px flex-1 border-t border-dashed border-surface-glass-border" />
                  ··· {formatGapLabel(gapDays)} ···
                  <span className="h-px flex-1 border-t border-dashed border-surface-glass-border" />
                </div>
              )}

              <div className="relative">
                <span className="absolute top-4 -left-9 flex size-7 items-center justify-center rounded-full border-2 border-bg-primary bg-bg-elevated text-caption shadow-card">
                  {PHOTO_TYPE_ICON[photo.type]}
                </span>

                <div className="flex gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150">
                  <button
                    type="button"
                    onClick={() => onZoom(photo)}
                    className="flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-bg-tertiary text-xl"
                  >
                    {photo.imageUrl ? (
                      <img src={photo.imageUrl} alt="" className="size-full object-cover" />
                    ) : (
                      '🌿'
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-caption font-bold text-brand-pink">
                      {dateLabel}
                      {suffix && ` · ${suffix}`}
                    </p>
                    <p className="mt-0.5 text-body-sm text-text-muted">
                      {formatGrowthDelta(days)}
                      {isLast && bucket === 'healthy' && ' · 🌿 Отличный рост!'}
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {photoTags(photo).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-bg-tertiary px-2 py-0.5 text-caption text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {photo.note && (
                      <p className="mt-1.5 text-body-sm text-text-secondary">{photo.note}</p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onZoom(photo)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-info/10 px-3 py-1.5 text-caption font-semibold text-info"
                      >
                        <ZoomIn size={13} />
                        Увеличить
                      </button>
                      {onCompare && photos.length >= 2 && (
                        <button
                          type="button"
                          onClick={() => onCompare(photo)}
                          className="rounded-full bg-info/10 px-3 py-1.5 text-caption font-semibold text-info"
                        >
                          ⚖️ Сравнить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
