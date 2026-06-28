import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mariiasolves.com',
  output: 'static',
  i18n: {
    locales: ['en', 'uk'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
