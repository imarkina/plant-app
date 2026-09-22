import { Droplet, Sun, Thermometer, Wind } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import { PlantReportView } from './PlantReportView';
import type { CareTask } from '../../care-tasks';
import { formatInterval, pluralizeRu } from '../../../shared/helpers';

const DAY_MS = 24 * 60 * 60 * 1000;

function photoCaption(days: number, isLast: boolean, isFirst: boolean): string {
  if (isFirst) {
    return 'Покупка';
  }
  if (isLast) {
    return 'Сейчас';
  }
  if (days < 30) {
    return `+${days} ${pluralizeRu(days, 'день', 'дня', 'дней')}`;
  }
  const months = Math.round(days / 30);
  return `+${months} ${pluralizeRu(months, 'месяц', 'месяца', 'месяцев')}`;
}

type Props = {
  plant: Plant;
  wateringTask: CareTask | null;
  onOpenAlbum: () => void;
};

export const PlantOverviewTab = ({ plant, wateringTask, onOpenAlbum }: Props) => {
  const analysis = plant.photos[0]?.analysis;
  const carePassport = analysis?.carePassport;
  const sortedPhotos = [...plant.photos].sort((a, b) => a.createdAt - b.createdAt);
  const firstPhotoTs = sortedPhotos[0]?.createdAt;

  return (
    <div>
      <PlantReportView analysis={analysis ?? null} />

      <p className="mt-7 text-h3 text-text-primary">🌿 Параметры ухода</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-surface-glass-border bg-surface-glass p-4 text-center shadow-card backdrop-blur-xl backdrop-saturate-150">
          <Droplet className="mx-auto text-info" size={20} />
          <p className="mt-2 text-h4 text-text-primary">
            {wateringTask ? formatInterval(wateringTask.intervalDays) : '—'}
          </p>
          <p className="text-caption text-text-muted uppercase">Полив</p>
        </div>
        <div className="rounded-xl border border-surface-glass-border bg-surface-glass p-4 text-center shadow-card backdrop-blur-xl backdrop-saturate-150">
          <Sun className="mx-auto text-warn" size={20} />
          <p className="mt-2 line-clamp-2 text-h4 text-text-primary">
            {carePassport?.lighting.summary ?? '—'}
          </p>
          <p className="text-caption text-text-muted uppercase">Свет</p>
        </div>
        <div className="rounded-xl border border-surface-glass-border bg-surface-glass p-4 text-center shadow-card backdrop-blur-xl backdrop-saturate-150">
          <Wind className="mx-auto text-brand-purple" size={20} />
          <p className="mt-2 text-h4 text-text-primary">{carePassport?.environment.humidity ?? '—'}</p>
          <p className="text-caption text-text-muted uppercase">Влажность</p>
        </div>
        <div className="rounded-xl border border-surface-glass-border bg-surface-glass p-4 text-center shadow-card backdrop-blur-xl backdrop-saturate-150">
          <Thermometer className="mx-auto text-brand-peach" size={20} />
          <p className="mt-2 line-clamp-2 text-h4 text-text-primary">
            {carePassport?.environment.temperatureOptimal ?? '—'}
          </p>
          <p className="text-caption text-text-muted uppercase">Температура</p>
        </div>
      </div>
      {!carePassport && (
        <p className="mt-2 text-caption text-text-muted">
          Свет/влажность/температура появятся после AI-диагностики этого растения.
        </p>
      )}

      <div className="mt-7 flex items-center justify-between">
        <p className="text-h3 text-text-primary">📸 Фотоальбом</p>
        <button
          type="button"
          onClick={onOpenAlbum}
          className="cursor-pointer text-body-sm font-semibold text-info"
        >
          Все {plant.photos.length} →
        </button>
      </div>

      {sortedPhotos.length === 0 ? (
        <p className="mt-3 text-body-sm text-text-muted">У этого растения пока нет фото.</p>
      ) : (
        <div className="scroll-fade-x mt-3 flex gap-3 overflow-x-auto pb-1">
          {sortedPhotos.map((photo, index) => {
            const isFirst = index === 0;
            const isLast = index === sortedPhotos.length - 1;
            const days = Math.round((photo.createdAt - firstPhotoTs) / DAY_MS);

            return (
              <button
                key={photo.id}
                type="button"
                onClick={onOpenAlbum}
                className="relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-bg-tertiary shadow-card"
              >
                {photo.imageUrl && (
                  <img src={photo.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
                )}
                <div className="absolute inset-0 bg-card-overlay" />
                <p className="absolute inset-x-0 bottom-1.5 truncate px-2 text-caption font-semibold text-white">
                  {photoCaption(days, isLast, isFirst)}
                </p>
              </button>
            );
          })}
        </div>
      )}

      <p className="mt-7 text-h3 text-text-primary">🌿 Соседство</p>
      <div className="mt-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
        <p className="text-body-sm text-text-muted">
          Скоро — подберём растения из твоей коллекции с похожими условиями по свету и влажности.
        </p>
      </div>

      <p className="mt-7 text-h3 text-text-primary">🪴 Профиль растения</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-body-sm">
        {plant.purchasedAt && (
          <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150">
            <p className="text-caption text-text-muted uppercase">Дата покупки</p>
            <p className="mt-1 font-semibold text-text-primary">
              {new Date(plant.purchasedAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}
        {plant.potDiameterCm != null && (
          <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150">
            <p className="text-caption text-text-muted uppercase">Горшок</p>
            <p className="mt-1 font-semibold text-text-primary">Ø {plant.potDiameterCm} см</p>
          </div>
        )}
      </div>
    </div>
  );
};
