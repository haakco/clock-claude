import type { Theme, ThemeConfig } from '../types';
import { blueTheme } from './blue';
import { pinkTheme } from './pink';

export const themes: Record<Theme, ThemeConfig> = {
  blue: blueTheme,
  pink: pinkTheme,
};

export function getTheme(themeName: Theme): ThemeConfig {
  return themes[themeName];
}

export { blueTheme, pinkTheme };
