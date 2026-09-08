import { useTheme } from '../../hooks/useTheme';
import { Leaf, Moon, Sun } from 'lucide-react';

export const Header = () => {
  const { theme, toggle } = useTheme();

  return (
    <>
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center text-accent">
          <Leaf />
        </div>
        <button
          type="button"
          onClick={toggle}
          className="flex size-10 desktop:size-11 cursor-pointer items-center justify-center rounded-md desktop:rounded-lg border border-surface-glass-border bg-bg-tertiary text-text-primary transition-all duration-100 hover:bg-bg-secondary active:scale-[0.9]"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>
      <h1 className="mb-6 text-hero desktop:text-hero-lg text-text-primary">Что растёт сегодня?</h1>
    </>
  );
};
