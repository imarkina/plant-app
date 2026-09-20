import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

/** Совпадают с --color-bg-primary в tokens.css — держим статус-бар/чёлку в цвет темы. */
const THEME_COLOR: Record<Theme, string> = {
  light: '#f6f4fb',
  dark: '#26233b',
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggle };
}
