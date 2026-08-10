import type { Plant } from '../models/plant.types';

type Props = {
  plants: Plant[];
};

export const PlantList = ({ plants }: Props) => {
  return (
    <div>
      {plants.map((plant) => {
        return <p key={plant.id}>{plant.name}</p>;
      })}
    </div>
  );
};
