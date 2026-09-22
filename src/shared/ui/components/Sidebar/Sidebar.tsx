import { NavLink } from 'react-router-dom';
import { Calendar, Home, Leaf, Moon, Sun, User } from 'lucide-react';
import { useThemeContext } from '../../hooks/useThemeContext';

const items = [
  { to: '/', label: 'Главная', icon: Home, end: true },
  { to: '/collection', label: 'Коллекция', icon: Leaf, end: false },
  { to: '/calendar', label: 'Календарь', icon: Calendar, end: false },
  { to: '/profile', label: 'Профиль', icon: User, end: false },
];

/** Постоянная левая навигация для desktop (≥1024px) — замена плавающему нижнему бару, который на широком экране выглядел как растянутый мобильный паттерн. BottomNav на этой ширине скрыт (см. desktop:hidden там). */
export const Sidebar = () => {
  const { theme, toggle } = useThemeContext();

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-[var(--z-nav)] hidden w-60 flex-col border-r border-surface-glass-border bg-surface-glass px-4 py-6 backdrop-blur-xl backdrop-saturate-150 desktop:flex">
      <div className="flex items-center gap-2 px-2 text-accent">
        <Leaf size={22} />
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-body-sm font-semibold text-text-secondary transition-colors duration-100 hover:text-text-primary"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                    isActive ? 'bg-brand text-white' : ''
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className={isActive ? 'text-text-primary' : ''}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggle}
        className="mt-auto flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-body-sm font-semibold text-text-secondary transition-colors duration-100 hover:text-text-primary"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-tertiary">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </span>
        {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
      </button>
    </aside>
  );
};
