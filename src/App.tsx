import './App.css';

import PlantForm, { PlantsProvider } from './features/plants';
import { useTheme } from './shared/ui/hooks/useTheme';

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div>
      <button onClick={toggle}>{theme === 'light' ? 'Темная' : 'Светлая'}</button>
      <PlantsProvider>
        <PlantForm />
      </PlantsProvider>
    </div>
  );
}

export default App;
