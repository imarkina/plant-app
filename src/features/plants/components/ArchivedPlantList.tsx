import { Link } from 'react-router-dom';
import type { Plant } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { formatDate } from '../../../shared/helpers';
import './ArchivedPlantList.css';

type Props = {
  plants: Plant[];
};

export const ArchivedPlantList = ({ plants }: Props) => {
  const { restore } = usePlantsContext();

  if (plants.length === 0) {
    return <p className="archived-plant-list__empty">В архиве пока пусто</p>;
  }

  return (
    <div className="archived-plant-list">
      {plants.map((plant) => {
        const photo = plant.photos[0];

        return (
          <div key={plant.id} className="archived-plant-row">
            <Link to={`/plant/${plant.id}`} className="archived-plant-row__link">
              {photo?.imageUrl && (
                <img src={photo.imageUrl} alt="" className="archived-plant-row__photo" />
              )}
              <div className="archived-plant-row__info">
                <p className="archived-plant-row__name">{plant.name}</p>
                {plant.archivedAt && (
                  <p className="archived-plant-row__date">
                    В архиве с {formatDate(new Date(plant.archivedAt).getTime())}
                  </p>
                )}
              </div>
            </Link>
            <button
              type="button"
              className="archived-plant-row__restore"
              onClick={() => void restore(plant.id)}
            >
              Восстановить
            </button>
          </div>
        );
      })}
    </div>
  );
};
