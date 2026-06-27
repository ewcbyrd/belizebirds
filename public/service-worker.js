// Service Worker for Belize Birds PWA
// Enables offline functionality with intelligent caching strategies

// Get BASE_URL from the scope (it will be injected by the registration)
const SCOPE = self.registration.scope;
const BASE_URL = SCOPE.endsWith('/') ? SCOPE : SCOPE + '/';

const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  shell: `shell-${CACHE_VERSION}`,
  assets: `assets-${CACHE_VERSION}`,
  data: `data-${CACHE_VERSION}`,
  audio: `audio-${CACHE_VERSION}`,
};

// Assets to cache on install
const SHELL_ASSETS = [
  BASE_URL,
];

// Patterns for cache-first assets (images, styles, scripts)
const CACHE_FIRST_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.svg$/,
  /\.(png|jpg|jpeg|webp)$/,
];

// Data files that should use network-first strategy
const NETWORK_FIRST_PATTERNS = [
  /birds\.json$/,
];

// Install event - cache shell assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAMES.shell).then((cache) => {
      console.log('[Service Worker] Caching shell assets');
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[Service Worker] Error caching shell:', err);
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          const isOldVersion = !Object.values(CACHE_NAMES).includes(cacheName);
          if (isOldVersion) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip requests outside our scope
  if (!url.pathname.startsWith(BASE_URL)) {
    return;
  }

  // Network-first strategy for birds.json (always get latest data)
  if (isNetworkFirstRequest(url.pathname)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Cache-first strategy for assets and images
  if (isCacheFirstRequest(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Default: try network, fall back to cache
  event.respondWith(networkFallbackStrategy(request));
});

// Network-first strategy: try network, fallback to cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful response
      const cache = await caches.open(CACHE_NAMES.data);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, using cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
  }
}

// Cache-first strategy: try cache, fallback to network
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cacheName = getCacheNameForAsset(request.url);
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Cache and network failed:', request.url);
    
    // Return offline fallback based on asset type
    if (request.destination === 'image') {
      return new Response('<svg></svg>', {
        headers: { 'Content-Type': 'image/svg+xml' },
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Network with cache fallback strategy
async function networkFallbackStrategy(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('[Service Worker] Network failed, using cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Determine which cache to use for asset
function getCacheNameForAsset(url) {
  if (url.includes('/audio/')) {
    return CACHE_NAMES.audio;
  }
  if (url.includes('/birds/')) {
    return CACHE_NAMES.assets;
  }
  return CACHE_NAMES.shell;
}

// Check if URL should use network-first strategy
function isNetworkFirstRequest(pathname) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(pathname));
}

// Check if URL should use cache-first strategy
function isCacheFirstRequest(pathname) {
  return CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(pathname));
}

// Handle messages from clients (for cache updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((name) => caches.delete(name)));
    });
  }
});
