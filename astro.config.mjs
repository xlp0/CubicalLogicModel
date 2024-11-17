import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  integrations: [
    tailwind(),
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ['@radix-ui/*', 'class-variance-authority']
    }
  },
  devToolbar: {
    enabled: false
  }
});
