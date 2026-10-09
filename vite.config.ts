import { defineConfig } from 'vite';

export default defineConfig({
  base: '/d4-cube/',
  server: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
});
