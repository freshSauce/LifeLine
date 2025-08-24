import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// LEE VITE_API_BASE de .env
const API_BASE = process.env.VITE_API_BASE || 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // redirige /api a FastAPI
      '/api': {
        target: API_BASE,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: { '@': '/src' },
  },
})
