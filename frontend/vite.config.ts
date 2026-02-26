import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests starting with `/api` to your backend server
      '/auth': {
        target: 'http://localhost:8080', // your backend URL
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/message': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
