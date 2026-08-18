import PlantForm from '../../features/plants';
import { BottomNav } from '../../shared/ui/components/BottomNav/BottomNav';
import { Header } from '../../shared/ui/components/Header/Header';

export const HomePage = () => {
  return (
    <div style={{ paddingBottom: '80px', maxWidth: '440px', margin: '0 auto' }}>
      <Header />
      <PlantForm />
      <BottomNav />
    </div>
  );
};
