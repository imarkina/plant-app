import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '../shared/query/queryClient';
import { PlantsProvider } from '../features/plants';
import { AuthProvider, ProtectedRoute } from '../features/auth';
import { BlobBackground } from '../shared/ui/components/BlobBackground/BlobBackground';
import { BottomNav } from '../shared/ui/components/BottomNav/BottomNav';
import { ErrorBoundary } from '../shared/ui/components/ErrorBoundary/ErrorBoundary';
import { GlobalToast } from '../shared/ui/components/GlobalToast/GlobalToast';

/**
 * Каждая страница — отдельный чанк вместо одного бандла на 650+ кБ: страницу
 * подгружает браузер только когда на неё реально переходят.
 */
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const CollectionPage = lazy(() =>
  import('../pages/CollectionPage').then((m) => ({ default: m.CollectionPage })),
);
const CalendarPage = lazy(() =>
  import('../pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);
const PlantPage = lazy(() => import('../pages/PlantPage').then((m) => ({ default: m.PlantPage })));
const AuthPage = lazy(() => import('../pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const ProfilePage = lazy(() =>
  import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const LocationsPage = lazy(() =>
  import('../pages/LocationsPage').then((m) => ({ default: m.LocationsPage })),
);

const RouteFallback = () => <p className="mt-6 text-body-sm text-text-muted">Загрузка...</p>;

const PlantsLayout = () => (
  <PlantsProvider>
    <Outlet />
    <BottomNav />
  </PlantsProvider>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BlobBackground />
        <div className="relative mx-auto max-w-full pb-28 tablet:max-w-[720px] desktop:max-w-[1024px] wide:max-w-[1280px]">
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/login" element={<AuthPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<PlantsLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/collection" element={<CollectionPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                      <Route path="/plant/:id" element={<PlantPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/locations" element={<LocationsPage />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </div>
        <GlobalToast />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
