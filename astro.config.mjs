import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    react({
      include: ['**/*.tsx'],
      experimentalReactChildren: true
    }),
    tailwind()
  ],
  server: {
    host: '0.0.0.0',
    headers: {
      // Add security headers
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
  },
  vite: {
    ssr: {
      noExternal: ['@radix-ui/*', 'class-variance-authority', 'lucide-react']
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@nanostores/react', 'lucide-react']
    },
    build: {
      commonjsOptions: {
        include: [/react-split-it/, /lucide-react/]
      }
    },
    // Enable environment variable loading in client-side code
    envPrefix: ['VITE_', 'PUBLIC_'],
    define: {
      'import.meta.env.AUTHENTIK_CLIENT_SECRET': JSON.stringify(process.env.AUTHENTIK_CLIENT_SECRET)
    },
    // Suppress development server logs
    logLevel: process.env.NODE_ENV === 'development' ? 'warn' : 'info',
    // Optimize React for development
    esbuild: {
      jsxInject: `import React from 'react'`
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
  middleware: {
    '/': async (request, next) => {
      const { authenticateRequest } = await import('./src/middleware/auth');
      
      // Attempt to authenticate the request
      const authenticatedRequest = await authenticateRequest({ request });
      
      // If authentication fails, continue with the original request
      return authenticatedRequest || next();
    }
  },
  devToolbar: {
    enabled: false
  }
});
