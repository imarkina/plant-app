import type { Plant } from '../models/plant.types';
import { Link } from 'react-router-dom';
import './PlantList.css';

type Props = {
  plants: Plant[];
};

export const PlantList = ({ plants }: Props) => {
  if (plants.length === 0) {
    return <p className="plant-list__empty">Пока нет растений. Загрузите первое фото!</p>;
  }

  return (
    <div className="plant-list">
      {plants.map((plant) => {
        const photo = plant.photos[0];

        if (!photo || !photo.analysis) {
          return null;
        }

        return (
          <Link key={plant.id} to={`/plant/${plant.id}`} className="plant-row">
            {photo.imageUrl && (
              <img
                src={photo.imageUrl}
                alt={photo.analysis.identification.commonName}
                className="plant-row__photo"
              />
            )}
            <div className="plant-row__info">
              <p className="plant-row__name">{photo.analysis.identification.commonName}</p>
              <p className="plant-row__species">{photo.analysis.identification.botanicalName}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
