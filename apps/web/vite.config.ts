import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
  },
  css: {
    postcss: './postcss.config.js',
  },
});