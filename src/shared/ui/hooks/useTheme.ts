import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggle };
}
