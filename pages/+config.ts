import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  // Use vike-react for React integration
  extends: [vikeReact],

  // Pre-render all pages at build time (SSG)
  prerender: true,

  // Enable SSR for pre-rendering (renders full HTML)
  ssr: true,
} satisfies Config;
