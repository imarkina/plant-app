import { NavLink } from 'react-router-dom';
import { Heart, Home, Leaf, User } from 'lucide-react';

const items = [
  { to: '/', label: 'Главная', icon: Home, end: true },
  { to: '/collection', label: 'Коллекция', icon: Leaf, end: false },
  { to: '/wishlist', label: 'Вишлист', icon: Heart, end: false },
  { to: '/profile', label: 'Профиль', icon: User, end: false },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 z-[var(--z-nav)] flex w-[calc(100%-32px)] max-w-[408px] -translate-x-1/2 items-center justify-around rounded-full border border-surface-glass-border bg-surface-glass px-2 py-2.5 backdrop-blur-xl backdrop-saturate-150 shadow-elevated">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-text-muted transition-colors duration-100"
        >
          {({ isActive }) => (
            <>
              {/* Активная иконка в круглом градиентном фоне (раздел 7: мобильный таб-бар). */}
              <span
                className={`flex size-9 items-center justify-center rounded-full transition-colors duration-200 ${
                  isActive ? 'bg-brand text-white' : ''
                }`}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="sr-only">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
