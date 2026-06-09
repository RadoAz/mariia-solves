import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mariiasolves.com',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
