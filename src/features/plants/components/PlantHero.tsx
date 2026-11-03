import { createElement } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Plant } from '../models/plant.types';
import {
  healthBucketToDotClassName,
  healthBucketToLabel,
  healthStatusToBucket,
} from '../models/report-status.mappers';
import { roomIcon } from '../../locations';

/** Иконка комнаты вычисляется по имени в рантайме — createElement вместо JSX, чтобы не смущать react-hooks/static-components. */
function roomBadge(name: string) {
  return (
    <span className="inline-flex items-center gap-1">
      {createElement(roomIcon(name), { size: 12 })}
      {name}
    </span>
  );
}

type Props = {
  plant: Plant;
  roomName: string | null;
  lightLabel: string | null;
  onOpenSettings: () => void;
};

export const PlantHero = ({ plant, roomName, lightLabel, onOpenSettings }: Props) => {
  const navigate = useNavigate();
  const photo = plant.photos[0];
  const analysis = photo?.analysis;
  const name = analysis?.identification.commonName ?? plant.name;
  const botanicalName = analysis?.identification.botanicalName;
  const bucket = analysis?.health.status ? healthStatusToBucket(analysis.health.status) : null;

  return (
    <div>
      <div className="relative h-[220px] overflow-hidden rounded-3xl tablet:h-[260px]">
        {photo?.imageUrl ? (
          <img src={photo.imageUrl} alt={name} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-tertiary text-5xl">🌿</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => void navigate(-1)}
            aria-label="Назад"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-transform active:scale-90"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Меню"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-transform active:scale-90"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4">
          {bucket && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-photo-overlay-border)] bg-[var(--color-photo-overlay)] px-3 py-1 text-caption font-semibold text-white backdrop-blur-xl backdrop-saturate-150">
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${healthBucketToDotClassName(bucket)}`}
                />
                <span className={`relative inline-flex size-full rounded-full ${healthBucketToDotClassName(bucket)}`} />
              </span>
              {healthBucketToLabel(bucket)}
            </span>
          )}
          <p className="mt-2 line-clamp-2 text-h1 text-white">{name}</p>
          {botanicalName && <p className="truncate text-body text-white/70 italic">{botanicalName}</p>}
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-caption text-white/80">
            {roomName && roomBadge(roomName)}
            {lightLabel && <span>· ☀️ {lightLabel}</span>}
            {plant.potDiameterCm != null && <span>· 🪴 Ø {plant.potDiameterCm} см</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
