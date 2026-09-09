import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ytbannerstudio.com',
  output: 'static',
  trailingSlash: 'never',
  redirects: {
    '/background': '/backgrounds',
    '/es/background': '/es/backgrounds',
    '/de/background': '/de/backgrounds',
    '/fr/background': '/fr/backgrounds',
    '/pt-br/background': '/pt-br/backgrounds',
    '/it/background': '/it/backgrounds',
    '/ja/background': '/ja/backgrounds',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'de', 'fr', 'pt-br', 'it', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
