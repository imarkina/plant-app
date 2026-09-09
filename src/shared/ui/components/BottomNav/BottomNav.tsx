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
    <nav className="fixed bottom-0 left-1/2 z-[var(--z-nav)] flex w-full max-w-[440px] -translate-x-1/2 items-center justify-around rounded-t-3xl border-t border-surface-glass-border bg-surface-glass px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150 shadow-elevated">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-2xl px-4 py-2 text-text-muted transition-colors duration-100 ${
              isActive ? 'bg-accent/15 text-accent' : ''
            }`
          }
        >
          <Icon size={20} strokeWidth={2} />
          <span className="sr-only">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
