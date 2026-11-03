import { Camera, Droplet } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import { healthBucketToDotClassName, healthStatusToBucket } from '../models/report-status.mappers';
import { formatDue, getCareStatus, getNextDue, type CareTask } from '../../care-tasks';
import { roomIcon } from '../../locations';
import { Badge } from '../../../shared/ui/components/Badge/Badge';

type Props = {
  plants: Plant[];
  locationNameById: Map<string, string>;
  careTasksByPlantId: Map<string, CareTask[]>;
  onSelect: (plantId: string) => void;
  /** US-ALBUM-5: показывать значок просроченного фото-напоминания, когда push отключён. */
  photoReminderBadgesEnabled?: boolean;
};

export const PlantGrid = ({
  plants,
  locationNameById,
  careTasksByPlantId,
  onSelect,
  photoReminderBadgesEnabled = false,
}: Props) => {
  if (plants.length === 0) {
    return <p className="mt-6 text-body-sm text-text-muted">Ничего не нашлось.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-4 desktop:gap-5 wide:grid-cols-4 wide:gap-6">
      {plants.map((plant) => {
        const photo = plant.photos[0];
        const analysis = photo?.analysis;
        const name = analysis?.identification.commonName ?? plant.name;
        const botanicalName = analysis?.identification.botanicalName;
        const roomName = plant.locationId ? locationNameById.get(plant.locationId) : undefined;
        const RoomIcon = roomName ? roomIcon(roomName) : null;

        const wateringTask = careTasksByPlantId
          .get(plant.id)
          ?.find((task) => task.type === 'watering');
        const wateringLabel = wateringTask ? formatDue(getNextDue(wateringTask)) : null;
        const isWateringOverdue = wateringTask ? getCareStatus(wateringTask) === 'overdue' : false;

        const photoTask = careTasksByPlantId.get(plant.id)?.find((task) => task.type === 'photo');
        const showPhotoReminderBadge =
          photoReminderBadgesEnabled && photoTask ? getCareStatus(photoTask) === 'overdue' : false;
        const dotClassName = analysis?.health.status
          ? healthBucketToDotClassName(healthStatusToBucket(analysis.health.status))
          : null;

        return (
          <button
            key={plant.id}
            type="button"
            onClick={() => onSelect(plant.id)}
            className="group block w-full overflow-hidden rounded-2xl border border-surface-glass-border bg-surface-glass text-left shadow-card backdrop-blur-xl backdrop-saturate-150 transition-transform duration-200 active:scale-[0.98] desktop:rounded-3xl"
          >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-bg-tertiary text-3xl">
              {photo?.imageUrl ? (
                <img
                  src={photo.imageUrl}
                  alt={name}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                '🌿'
              )}

              {dotClassName && (
                <span className="absolute top-2.5 right-2.5 flex size-3 desktop:size-3.5">
                  <span
                    className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${dotClassName}`}
                  />
                  <span
                    className={`relative inline-flex size-full rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${dotClassName}`}
                  />
                </span>
              )}

              <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1">
                {wateringLabel && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-photo-overlay-border)] bg-[var(--color-photo-overlay)] px-2 py-1 text-caption font-medium text-white backdrop-blur-xl backdrop-saturate-150 desktop:px-2.5 desktop:py-1.5 desktop:text-caption-lg"
                  >
                    <Droplet size={12} className={isWateringOverdue ? 'text-danger' : 'text-white'} />
                    {wateringLabel}
                  </span>
                )}
                {showPhotoReminderBadge && (
                  <span
                    title="Пора сделать фото"
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-photo-overlay-border)] bg-[var(--color-photo-overlay)] px-2 py-1 text-caption font-medium text-danger backdrop-blur-xl backdrop-saturate-150 desktop:px-2.5 desktop:py-1.5 desktop:text-caption-lg"
                  >
                    <Camera size={12} />
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 desktop:p-4">
              <p className="truncate text-h4 text-text-primary desktop:text-h3">{name}</p>
              {botanicalName && (
                <p className="truncate text-body-sm text-text-muted italic">{botanicalName}</p>
              )}
              {isWateringOverdue && (
                <div className="mt-2">
                  <Badge variant="danger">Просрочен полив</Badge>
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-caption text-text-secondary">
                {roomName && RoomIcon && (
                  <span className="inline-flex items-center gap-1 truncate rounded-full bg-bg-tertiary px-2 py-0.5">
                    <RoomIcon size={11} />
                    {roomName}
                  </span>
                )}
                <span className="shrink-0">
                  · {plant.photos.length} фото
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
