import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import vike from 'vike/plugin';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
    tailwindcss(),
    vike(),
  ],
  // Custom domain clock.catrgb.com serves from root
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
