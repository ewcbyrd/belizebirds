import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/belizebirds/' : '/',
  server: {
    // Serve public files directly in dev mode
    middlewareMode: false,
  },
  build: {
    // Ensure service worker is copied to dist
    copyPublicDir: true,
  },
})
