import type { Plant } from '../models/plant.types';

type Props = {
  plants: Plant[];
};

export const PlantList = ({ plants }: Props) => {
  return (
    <div>
      {plants.map((plant) => {
        return (
          <div key={plant.id}>
            <p>Имя файла: {plant.name}</p>
            {plant.photos[0]?.imageUrl && <img src={plant.photos[0]?.imageUrl} alt={plant.name} />}
          </div>
        );
      })}
    </div>
  );
};
