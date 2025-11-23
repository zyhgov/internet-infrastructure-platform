import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // ✅ 本地开发时的代理配置
  server: {
    proxy: {
      '/api': {
        target: 'https://uapis.cn/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Dev Proxy]', req.method, req.url, '→', options.target + req.url.replace(/^\/api/, ''));
          });
        }
      }
    }
  }
})