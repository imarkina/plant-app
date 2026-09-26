import { type ChangeEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Home, Leaf, Loader2, Plus, User } from 'lucide-react';
import { useAuthContext } from '../../../../features/auth';
import { useAddPlant } from '../../../../features/plants/hooks/useAddPlant';
import { deriveDisplayName } from '../../../helpers';

const items = [
  { to: '/', label: 'Главная', icon: Home, end: true },
  { to: '/collection', label: 'Коллекция', icon: Leaf, end: false },
  { to: '/calendar', label: 'Календарь', icon: Calendar, end: false },
];

const CARD = 'rounded-3xl border border-surface-glass-border bg-surface-glass shadow-card backdrop-blur-xl backdrop-saturate-150';

/**
 * Постоянная левая навигация для desktop (≥1024px), выстроенная как стопка
 * отдельных карточек (по образцу ВТБ-онлайна) вместо одной сплошной панели:
 * профиль / меню / быстрое действие — три независимых блока с зазором между
 * ними. BottomNav на этой ширине скрыт (см. desktop:hidden там).
 */
export const Sidebar = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { addPlantFromFile, loading } = useAddPlant();

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const plantId = await addPlantFromFile(file);

    if (plantId) {
      void navigate(`/plant/${plantId}`);
    }
  };

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-[var(--z-nav)] hidden w-60 flex-col gap-4 overflow-y-auto px-4 py-6 desktop:flex">
      <div className="flex items-center gap-2 px-2 text-accent">
        <Leaf size={22} />
      </div>

      <NavLink
        to="/profile"
        className={`flex items-center gap-3 px-4 py-4 transition-colors duration-100 hover:border-accent/40 ${CARD}`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <User size={18} />
        </span>
        <span className="truncate text-body-sm font-semibold text-text-primary">
          {deriveDisplayName(user?.email ?? null)}
        </span>
      </NavLink>

      <nav className={`flex flex-col gap-1 p-2 ${CARD}`}>
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

      <label className={`flex cursor-pointer items-center gap-3 px-4 py-3.5 transition-transform duration-100 active:scale-[0.98] ${CARD}`}>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => void handleFileSelect(event)}
          disabled={loading}
          className="hidden"
        />
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={2.5} />}
        </span>
        <span className="text-body-sm font-semibold text-text-primary">
          {loading ? 'Добавляем...' : 'Добавить новое фото'}
        </span>
      </label>
    </aside>
  );
};
