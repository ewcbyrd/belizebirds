/**
 * Service Worker Registration
 * Production only — dev cleanup runs from index.html before modules load.
 */

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const basePath = import.meta.env.BASE_URL;
    const swPath = basePath + 'service-worker.js';
    const swScope = basePath;

    navigator.serviceWorker
      .register(swPath, { scope: swScope })
      .then((registration) => {
        console.log('[App] Service Worker registered:', registration);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch((error) => {
        console.error('[App] Service Worker registration failed:', error);
      });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
