import { createElement, type ChangeEvent } from 'react';
import { ArrowLeft, Camera, Droplet, MoreHorizontal, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Plant } from '../models/plant.types';
import { healthBucketToDotClassName, healthStatusToBucket } from '../models/report-status.mappers';
import { roomIcon } from '../../locations';
import type { CareTask } from '../../care-tasks';

const HEALTH_LABEL = { healthy: 'Здорова', warning: 'Внимание', sick: 'Болеет' } as const;

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
  wateringTask: CareTask | null;
  onWater: () => void;
  onPhotoSelected: (file: File) => void;
  onDiagnosis: () => void;
  onOpenSettings: () => void;
  /** По умолчанию navigate(-1); переопределяется, когда герой встроен в bottom sheet (там "назад" = закрыть лист). */
  onBack?: () => void;
  /** Отрицательный margin, которым фото «пробивает» боковой паддинг контейнера — на странице это body (24px = -mx-6), в BottomSheet это его собственный паддинг (16px = -mx-4). */
  bleedClassName?: string;
  titleId?: string;
};

export const PlantHero = ({
  plant,
  roomName,
  lightLabel,
  wateringTask,
  onWater,
  onPhotoSelected,
  onDiagnosis,
  onOpenSettings,
  onBack,
  bleedClassName = '-mx-6',
  titleId,
}: Props) => {
  const navigate = useNavigate();
  const photo = plant.photos[0];
  const analysis = photo?.analysis;
  const name = analysis?.identification.commonName ?? plant.name;
  const botanicalName = analysis?.identification.botanicalName;
  const bucket = analysis?.health.status ? healthStatusToBucket(analysis.health.status) : null;

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoSelected(file);
    }
    event.target.value = '';
  };

  return (
    <div>
      <div className={`relative ${bleedClassName} h-[300px] overflow-hidden tablet:h-[360px]`}>
        {photo?.imageUrl ? (
          <img src={photo.imageUrl} alt={name} className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-tertiary text-5xl">🌿</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : navigate(-1))}
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-elevated/90 px-3 py-1 text-caption font-semibold text-text-primary shadow-card backdrop-blur-xl">
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${healthBucketToDotClassName(bucket)}`}
                />
                <span className={`relative inline-flex size-full rounded-full ${healthBucketToDotClassName(bucket)}`} />
              </span>
              {HEALTH_LABEL[bucket]}
            </span>
          )}
          <p id={titleId} className="mt-2 truncate text-h1 text-white">
            {name}
          </p>
          {botanicalName && <p className="truncate text-body text-white/70 italic">{botanicalName}</p>}
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-caption text-white/80">
            {roomName && roomBadge(roomName)}
            {lightLabel && <span>· ☀️ {lightLabel}</span>}
            {plant.potDiameterCm != null && <span>· 🪴 Ø {plant.potDiameterCm} см</span>}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onWater}
          disabled={!wateringTask}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-brand px-3 py-3 text-body-sm font-semibold text-white shadow-card active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
        >
          <Droplet size={16} /> Полить
        </button>
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-3 text-body-sm font-semibold text-text-primary shadow-card active:scale-[0.97]">
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          <Camera size={16} /> Фото
        </label>
        <button
          type="button"
          onClick={onDiagnosis}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-3 text-body-sm font-semibold text-text-primary shadow-card active:scale-[0.97]"
        >
          <Stethoscope size={16} /> Диагноз
        </button>
      </div>
    </div>
  );
};
