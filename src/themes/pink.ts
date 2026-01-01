import { ThemeConfig } from '../types';

export const pinkTheme: ThemeConfig = {
  name: 'pink',
  colors: {
    primary: '#ec4899', // pink-500
    secondary: '#be185d', // pink-700
    accent: '#a855f7', // purple-500
    background: '#fdf2f8', // pink-50
    clockFace: '#ffffff',
    clockBorder: '#9d174d', // pink-800
    hourHand: '#831843', // pink-900
    minuteHand: '#ec4899', // pink-500
    numbers: '#9d174d', // pink-800
    centerDot: '#f472b6', // pink-400
  },
  decorations: ['butterfly', 'flower', 'unicorn', 'heart', 'rainbow', 'star'],
};
