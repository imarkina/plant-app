import { useTheme } from '../../hooks/useTheme';
import { Leaf, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthContext } from '../../../../features/auth';
import './Header.css';

export const Header = () => {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuthContext();

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo">
            <Leaf />
          </div>
        </div>
        <div className="app-header__actions">
          {user && (
            <button
              className="app-header__theme"
              onClick={() => void signOut()}
              aria-label="Выйти"
              title="Выйти"
            >
              <LogOut size={18} />
            </button>
          )}
          <button className="app-header__theme" onClick={toggle}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>
      <h1 className="home-greeting">Что растёт сегодня?</h1>
    </>
  );
};
