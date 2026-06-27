/**
 * Service Worker Registration
 * Registers the service worker for offline PWA functionality
 */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const basePath = import.meta.env.BASE_URL;
    const swPath = basePath + 'service-worker.js';
    const swScope = basePath;
    
    navigator.serviceWorker.register(swPath, {
      scope: swScope
    }).then((registration) => {
      console.log('[App] Service Worker registered:', registration);
    }).catch((error) => {
      console.error('[App] Service Worker registration failed:', error);
    });
  });
}
