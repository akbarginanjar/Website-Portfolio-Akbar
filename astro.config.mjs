import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://akbarginanjar.vercel.app',
  integrations: [tailwind(), sitemap(), react()],
  vite: {
    assetsInclude: ['**/*.glb']
  }
});
