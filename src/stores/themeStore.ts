import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'pink',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'blue' ? 'pink' : 'blue',
        })),
    }),
    {
      name: 'clock-game-theme',
    }
  )
);
