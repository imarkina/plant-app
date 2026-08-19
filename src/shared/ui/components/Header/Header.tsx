import { useTheme } from '../../hooks/useTheme';
import { Leaf, Moon, Sun } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const { theme, toggle } = useTheme();

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">
            <Leaf />
          </div>
        </div>
        <button className="app-header__theme" onClick={toggle}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>
      <h1 className="home-greeting">Что растёт сегодня?</h1>
    </>
  );
};
