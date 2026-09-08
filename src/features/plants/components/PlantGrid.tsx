import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import { healthBucketToDotClassName, healthStatusToBucket } from '../models/report-status.mappers';
import { formatDue, getCareStatus, getNextDue, type CareTask } from '../../care-tasks';

type Props = {
  plants: Plant[];
  locationNameById: Map<string, string>;
  careTasksByPlantId: Map<string, CareTask[]>;
};

export const PlantGrid = ({ plants, locationNameById, careTasksByPlantId }: Props) => {
  if (plants.length === 0) {
    return <p className="mt-6 text-body-sm text-text-muted">Ничего не нашлось.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-4 desktop:gap-5 wide:grid-cols-4 wide:gap-6">
      {plants.map((plant) => {
        const photo = plant.photos[0];
        const analysis = photo?.analysis;
        const name = analysis?.identification.commonName ?? plant.name;
        const roomName = plant.locationId ? locationNameById.get(plant.locationId) : undefined;

        const wateringTask = careTasksByPlantId
          .get(plant.id)
          ?.find((task) => task.type === 'watering');
        const wateringLabel = wateringTask ? formatDue(getNextDue(wateringTask)) : null;
        const isWateringOverdue = wateringTask ? getCareStatus(wateringTask) === 'overdue' : false;

        return (
          <Link
            key={plant.id}
            to={`/plant/${plant.id}`}
            className="group relative block aspect-[1/1.15] overflow-hidden rounded-2xl bg-bg-tertiary transition-transform duration-200 active:scale-[0.98] tablet:aspect-[1/1.1] desktop:aspect-[1/1.05] desktop:rounded-3xl wide:aspect-square"
          >
            {photo?.imageUrl && (
              <img
                src={photo.imageUrl}
                alt={name}
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-card-overlay" />

            {analysis?.health.status && (
              <span
                className={`absolute top-3 right-3 size-2.5 rounded-full desktop:size-3 ${healthBucketToDotClassName(
                  healthStatusToBucket(analysis.health.status),
                )}`}
              />
            )}

            {wateringLabel && (
              <span
                className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-lg bg-bg-elevated/80 px-2 py-1 text-caption backdrop-blur-sm desktop:rounded-xl desktop:px-2.5 desktop:py-1.5 desktop:text-caption-lg ${
                  isWateringOverdue ? 'text-danger' : 'text-text-primary'
                }`}
              >
                <Droplet size={12} />
                {wateringLabel}
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 p-3 desktop:p-4">
              <p className="truncate text-h4 text-text-primary desktop:text-h3">{name}</p>
              {roomName && (
                <p className="truncate text-caption text-text-secondary desktop:text-body-sm">
                  {roomName}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
