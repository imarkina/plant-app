import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';

import { HomePage } from '../pages/HomePage';
import { CollectionPage } from '../pages/CollectionPage';
import { CalendarPage } from '../pages/CalendarPage';
import { WishlistPage } from '../pages/WishlistPage';
import { DiagnosisPage } from '../pages/DiagnosisPage';
import { AddPlantPage } from '../pages/AddPlantPage';
import { PlantPage } from '../pages/PlantPage';
import { AuthPage } from '../pages/AuthPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LocationsPage } from '../pages/LocationsPage';
import { PlantsProvider } from '../features/plants';
import { AuthProvider, ProtectedRoute } from '../features/auth';
import { BlobBackground } from '../shared/ui/components/BlobBackground/BlobBackground';
import { BottomNav } from '../shared/ui/components/BottomNav/BottomNav';

const PlantsLayout = () => (
  <PlantsProvider>
    <Outlet />
    <BottomNav />
  </PlantsProvider>
);

function App() {
  return (
    <>
      <BlobBackground />
      <div className="relative mx-auto max-w-full pb-28 tablet:max-w-[720px] desktop:max-w-[1024px] wide:max-w-[1280px]">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<PlantsLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/collection" element={<CollectionPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/diagnosis" element={<DiagnosisPage />} />
                  <Route path="/add" element={<AddPlantPage />} />
                  <Route path="/plant/:id" element={<PlantPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
