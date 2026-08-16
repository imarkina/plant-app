import { Link, useParams } from 'react-router-dom';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { PlantReportView } from '../../features/plants/components/PlantReportView';
import { PlantPreview } from '../../features/plants/components/PlantPreview';

export const PlantPage = () => {
  const { id } = useParams();
  const { plants, loading } = usePlantsContext();

  const plant = plants.find((p) => p.id === id);

  if (loading) return <p>Загрузка...</p>;

  if (!plant || !plant.photos[0]) return <p>Не найдено...</p>;

  return (
    <>
      <Link to="/">Назад к растениям</Link>
      {plant.photos[0].imageUrl && <PlantPreview previewUrl={plant.photos[0].imageUrl} />}
      <PlantReportView analysis={plant.photos[0].analysis ?? null} />
    </>
  );
};
