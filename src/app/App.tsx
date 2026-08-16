import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { useTheme } from '../shared/ui/hooks/useTheme';
import { HomePage } from '../pages/HomePage';
import { PlantPage } from '../pages/PlantPage';
import { PlantsProvider } from '../features/plants';

function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <button onClick={toggle}>{theme === 'light' ? 'Темная' : 'Светлая'}</button>
      <PlantsProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plant/:id" element={<PlantPage />} />
        </Routes>
      </PlantsProvider>
    </BrowserRouter>
  );
}

export default App;
