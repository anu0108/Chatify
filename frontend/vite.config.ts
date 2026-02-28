import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': { target: 'http://localhost:8080', changeOrigin: true },
      '/users': { target: 'http://localhost:8080', changeOrigin: true },
      '/message': { target: 'http://localhost:8080', changeOrigin: true },
      '/socket.io': { 
        target: 'http://localhost:8080', 
        changeOrigin: true, 
        ws: true  // enable websocket proxying
      },
    }
  }
})