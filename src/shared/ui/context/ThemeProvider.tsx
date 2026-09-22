import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

const STORAGE_KEY = 'theme';

/** Совпадают с --color-bg-primary в tokens.css — держим статус-бар/чёлку в цвет темы. */
const THEME_COLOR: Record<Theme, string> = {
  light: '#f6f4fb',
  dark: '#26233b',
};

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // приватный режим/заблокированное хранилище — тема просто не переживёт перезагрузку
    }
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};
