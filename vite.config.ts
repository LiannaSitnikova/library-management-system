import { defineConfig } from 'vite';

export default defineConfig({
  base: '/library-management-system/',
  root: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    open: true,
  },
});