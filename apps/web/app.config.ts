import { createApp } from 'vinxi';

export default createApp({
  server: {
    compatibilityDate: '2026-06-06',
    devProxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // API 没有 /api 全局前缀，剥离 web 端的 /api 前缀
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  routers: [
    {
      name: 'public',
      type: 'static',
      dir: './public',
    },
    {
      name: 'client',
      type: 'spa',
      handler: './index.html',
      target: 'browser',
    },
  ],
});
