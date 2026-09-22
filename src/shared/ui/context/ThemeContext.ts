import { createContext } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
