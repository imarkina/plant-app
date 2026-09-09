import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';

import { HomePage } from '../pages/HomePage';
import { PlantPage } from '../pages/PlantPage';
import { AuthPage } from '../pages/AuthPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LocationsPage } from '../pages/LocationsPage';
import { PlantsProvider } from '../features/plants';
import { AuthProvider, ProtectedRoute } from '../features/auth';
import { BlobBackground } from '../shared/ui/components/BlobBackground/BlobBackground';

const PlantsLayout = () => (
  <PlantsProvider>
    <Outlet />
  </PlantsProvider>
);

function App() {
  return (
    <>
      <BlobBackground />
      <div className="relative mx-auto max-w-full pb-20 tablet:max-w-[720px] desktop:max-w-[1024px] wide:max-w-[1280px]">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<PlantsLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/plant/:id" element={<PlantPage />} />
                  <Route path="/feed" element={<div>Скоро</div>} />
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
