import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/matrix-cube/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/*', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: '행렬 큐브 (Matrix Cube)',
        short_name: 'MatrixCube',
        id: '/matrix-cube/',
        start_url: '/matrix-cube/',
        scope: '/matrix-cube/',
        description: '군론(D4 대칭군) 기반 3x3 행렬 큐브 퍼즐 게임',
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
