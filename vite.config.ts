import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // US-ALBUM-5: pull in the push/notificationclick handlers so real Web Push
      // subscriptions (see features/reminders) have a service worker to receive them.
      workbox: {
        importScripts: ['push-sw.js'],
      },
      manifest: {
        name: 'Plant Care',
        short_name: 'Plants',
        description: 'Уход за растениями с AI-диагностикой',
        // Совпадает со светлой темой по умолчанию (tokens.css --color-bg-primary) —
        // это цвет сплэш-скрина и статус-бара при первом запуске PWA.
        theme_color: '#f8f6f3',
        background_color: '#f8f6f3',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
