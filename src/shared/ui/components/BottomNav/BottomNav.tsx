import { NavLink } from 'react-router-dom';
import { Home, Users, User } from 'lucide-react';
import './BottomNav.css';

const items = [
  { to: '/', label: 'Главная', icon: Home, end: true },
  { to: '/feed', label: 'Лента', icon: Users, end: false },
  { to: '/profile', label: 'Профиль', icon: User, end: false },
];

export const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            isActive ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'
          }
        >
          <Icon size={22} strokeWidth={2} />
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
