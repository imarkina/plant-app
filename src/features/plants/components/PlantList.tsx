import type { Plant } from '../models/plant.types';
import { Link } from 'react-router-dom';

type Props = {
  plants: Plant[];
};

export const PlantList = ({ plants }: Props) => {
  return (
    <div>
      {plants.map((plant) => {
        return (
          <Link key={plant.id} to={`/plant/${plant.id}`}>
            <div>
              <p>Имя файла: {plant.name}</p>
              {plant.photos[0]?.imageUrl && (
                <img src={plant.photos[0]?.imageUrl} alt={plant.name} />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};
