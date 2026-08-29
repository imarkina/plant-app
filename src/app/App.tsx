import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';

import { HomePage } from '../pages/HomePage';
import { PlantPage } from '../pages/PlantPage';
import { AuthPage } from '../pages/AuthPage';
import { PlantsProvider } from '../features/plants';
import { AuthProvider, ProtectedRoute } from '../features/auth';

const PlantsLayout = () => (
  <PlantsProvider>
    <Outlet />
  </PlantsProvider>
);

function App() {
  return (
    <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<PlantsLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/plant/:id" element={<PlantPage />} />
                <Route path="/feed" element={<div>Скоро</div>} />
                <Route path="/profile" element={<div>Скоро</div>} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
