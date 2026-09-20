import { Link } from 'react-router-dom';
import type { Plant } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { formatDate } from '../../../shared/helpers';

type Props = {
  plants: Plant[];
};

export const ArchivedPlantList = ({ plants }: Props) => {
  const { restore } = usePlantsContext();

  if (plants.length === 0) {
    return <p className="mt-6 text-body-sm text-text-muted">В архиве пока пусто</p>;
  }

  return (
    <div className="mt-6 flex flex-col gap-2.5">
      {plants.map((plant) => {
        const photo = plant.photos[0];

        return (
          <div
            key={plant.id}
            className="flex items-center gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 opacity-75 shadow-card backdrop-blur-xl backdrop-saturate-150"
          >
            <Link to={`/plant/${plant.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              {photo?.imageUrl && (
                <img
                  src={photo.imageUrl}
                  alt=""
                  className="size-12 shrink-0 rounded-xl object-cover grayscale"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-h4 text-text-primary">{plant.name}</p>
                {plant.archivedAt && (
                  <p className="mt-0.5 truncate text-body-sm text-text-muted">
                    В архиве с {formatDate(new Date(plant.archivedAt).getTime())}
                  </p>
                )}
              </div>
            </Link>
            <button
              type="button"
              onClick={() => void restore(plant.id)}
              className="shrink-0 cursor-pointer rounded-full border border-surface-glass-border bg-surface-glass px-3 py-2 text-body-sm font-semibold text-text-primary shadow-md backdrop-blur-xl backdrop-saturate-150"
            >
              Восстановить
            </button>
          </div>
        );
      })}
    </div>
  );
};
