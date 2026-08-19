import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import { HomePage } from '../pages/HomePage';
import { PlantPage } from '../pages/PlantPage';
import { PlantsProvider } from '../features/plants';

function App() {
  return (
    <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <BrowserRouter>
        <PlantsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/plant/:id" element={<PlantPage />} />
            <Route path="/feed" element={<div>Скоро</div>} />
            <Route path="/profile" element={<div>Скоро</div>} />
          </Routes>
        </PlantsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
