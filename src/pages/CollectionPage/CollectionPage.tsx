import PlantForm from '../../features/plants';
import { BottomNav } from '../../shared/ui/components/BottomNav/BottomNav';
import { Header } from '../../shared/ui/components/Header/Header';

export const CollectionPage = () => {
  return (
    <>
      <Header />
      <PlantForm />
      <BottomNav />
    </>
  );
};
