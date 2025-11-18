import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://card.leheavengame.com',
        changeOrigin: true,
        // 如果服务端需要移除前缀，可开启 rewrite：
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
