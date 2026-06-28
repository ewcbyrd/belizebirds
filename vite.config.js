import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Block service worker in dev — public/service-worker.js is copied to dist for production only.
function disableServiceWorkerInDev() {
  return {
    name: 'disable-service-worker-in-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url.endsWith('/service-worker.js')) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain')
          res.end('Service worker disabled in development')
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), disableServiceWorkerInDev()],
  base: mode === 'production' ? '/belizebirds/' : '/',
  server: {
    middlewareMode: false,
  },
  build: {
    copyPublicDir: true,
  },
}))
