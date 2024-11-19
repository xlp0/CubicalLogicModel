import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable server-side rendering
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    host: '0.0.0.0',
    headers: {
      // Add security headers
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  integrations: [
    react(),
    tailwind()
  ],
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
    },
    // Enable environment variable loading in client-side code
    envPrefix: ['VITE_', 'PUBLIC_'],
    define: {
      'import.meta.env.AUTHENTIK_CLIENT_SECRET': JSON.stringify(process.env.AUTHENTIK_CLIENT_SECRET),
      'import.meta.env.PUBLIC_AUTHENTIK_CLIENT_ID': JSON.stringify(process.env.PUBLIC_AUTHENTIK_CLIENT_ID),
    },
    server: {
      proxy: {
        // Only proxy the Authentik authorization endpoint
        '/application/o/authorize/': {
          target: 'https://auth.pkc.pub',
          changeOrigin: true,
          secure: true
        },
        // Only proxy the token endpoint
        '/application/o/token/': {
          target: 'https://auth.pkc.pub',
          changeOrigin: true,
          secure: true
        },
        // Only proxy the userinfo endpoint
        '/application/o/userinfo/': {
          target: 'https://auth.pkc.pub',
          changeOrigin: true,
          secure: true
        }
      }
    }
  },
  devToolbar: {
    enabled: false
  }
});
