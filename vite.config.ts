import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/d4-cube/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/*', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'D4 행렬 큐브',
        short_name: 'D4Cube',
        id: 'https://galua2001.github.io/d4-cube/',
        start_url: '/d4-cube/',
        scope: '/d4-cube/',
        description: 'D4 대칭군 기반 행렬 큐브 퍼즐',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
});
