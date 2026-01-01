import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
  // Only use base path for production builds (GitHub Pages)
  base: command === 'build' ? '/clock-claude/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}));
