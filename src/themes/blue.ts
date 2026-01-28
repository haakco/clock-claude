import type { ThemeConfig } from '../types';

export const blueTheme: ThemeConfig = {
  name: 'blue',
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#1d4ed8', // blue-700
    accent: '#06b6d4', // cyan-500
    background: '#eff6ff', // blue-50
    clockFace: '#ffffff',
    clockBorder: '#1e40af', // blue-800
    hourHand: '#1e3a8a', // blue-900
    minuteHand: '#3b82f6', // blue-500
    numbers: '#1e40af', // blue-800
    centerDot: '#f59e0b', // amber-500
  },
  decorations: ['rocket', 'star', 'planet', 'dinosaur', 'car', 'football'],
};
