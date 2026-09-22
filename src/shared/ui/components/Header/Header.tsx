import { useThemeContext } from '../../hooks/useThemeContext';
import { Leaf, Moon, Sun } from 'lucide-react';

type Props = {
  title?: string;
};

export const Header = ({ title }: Props) => {
  const { theme, toggle } = useThemeContext();

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
      {title && (
        <h1 className="mb-6 text-hero desktop:text-hero-lg text-text-primary">{title}</h1>
      )}
    </>
  );
};
