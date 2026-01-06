import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',  // Changed from 'prompt'
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      manifest: {
        name: 'GamesCookie',
        short_name: 'GamesCookie',
        description: 'Play awesome games online',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',  // Optional but recommended for games
        theme_color: '#f8e71c',
        background_color: '#3d1318',
        icons: [
          {
            src: '/icons/192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'  // ✅ CRITICAL for Android
          },
          {
            src: '/icons/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'  // ✅ CRITICAL for Android
          }
        ],
      },
    }),
  ],
});