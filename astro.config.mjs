import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://douro-soulfood.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'compile',
  }),

  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  integrations: [
    sitemap(),
    keystatic(),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['sharp'],
      optimizeDeps: {
        exclude: ['@keystatic/astro/internal/keystatic-api.js'],
      },
    },
  },
});
