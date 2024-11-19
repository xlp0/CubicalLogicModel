import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable server-side rendering
  server: {
    host: '0.0.0.0'
  },
  integrations: [react(), tailwind()],
  vite: {
    ssr: {
      noExternal: ['@radix-ui/*', 'class-variance-authority']
    },
    optimizeDeps: {
      include: ['react-split-it']
    },
    build: {
      commonjsOptions: {
        include: [/react-split-it/]
      }
    }
  },
  devToolbar: {
    enabled: false
  }
});
