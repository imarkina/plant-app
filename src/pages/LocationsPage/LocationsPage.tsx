import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import {
  LocationForm,
  LocationList,
  LocationsProvider,
  useLocationsContext,
} from '../../features/locations';
import './LocationsPage.css';

const LocationsPageContent = () => {
  const { loading } = useLocationsContext();

  if (loading) {
    return (
      <div>
        <BackButton />
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <h1 className="locations-page__title">Локации</h1>
      <LocationList />
      <h2 className="locations-page__subtitle">Добавить локацию</h2>
      <LocationForm />
    </div>
  );
};

export const LocationsPage = () => (
  <LocationsProvider>
    <LocationsPageContent />
  </LocationsProvider>
);
