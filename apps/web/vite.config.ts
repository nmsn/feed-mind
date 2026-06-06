import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});