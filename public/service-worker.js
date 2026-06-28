// Service Worker for Belize Birds PWA
// Pre-caches bird images + app shell on first install for offline field use.
// App shell (HTML/JS/CSS): network-first. Bird images: cache-first.

// Bump when deploy changes hashed JS/CSS so clients drop stale app-shell caches.
const CACHE_VERSION = 'v2';
const CACHE_NAME = `belizebirds-${CACHE_VERSION}`;

// Static shell assets only — never pre-cache index.html (hashed asset URLs change each build).
const SHELL_ASSETS = [
  './manifest.json',
  './favicon.svg',
  './icons.svg',
  './hero-banner.jpg',
];

// All 147 bird images for offline birding field guide
const BIRD_IMAGES = [
  './birds/amazon-kingfisher.jpg',
  './birds/azure-crowned-hummingbird.jpg',
  './birds/band-backed-wren.jpg',
  './birds/bare-throated-tiger-heron.jpg',
  './birds/barred-antshrike.jpg',
  './birds/bat-falcon.jpg',
  './birds/black-and-white-hawk-eagle.jpg',
  './birds/black-cheeked-woodpecker.jpg',
  './birds/black-cowled-oriole.jpg',
  './birds/black-crowned-tityra.jpg',
  './birds/black-faced-grosbeak.jpg',
  './birds/black-hawk-eagle.jpg',
  './birds/black-headed-saltator.jpg',
  './birds/black-headed-trogon.jpg',
  './birds/black-throated-shrike-tanager.jpg',
  './birds/blue-black-grassquit.jpg',
  './birds/blue-black-grosbeak.jpg',
  './birds/blue-bunting.jpg',
  './birds/blue-gray-tanager.jpg',
  './birds/blue-ground-dove.jpg',
  './birds/boat-billed-flycatcher.jpg',
  './birds/bright-rumped-attila.jpg',
  './birds/brown-hooded-parrot.jpg',
  './birds/brown-jay.jpg',
  './birds/buff-throated-saltator.jpg',
  './birds/cabaniss-wren.jpg',
  './birds/canivets-emerald.jpg',
  './birds/chestnut-colored-woodpecker.jpg',
  './birds/cinnamon-bellied-saltator.jpg',
  './birds/collared-aracari.jpg',
  './birds/collared-forest-falcon.jpg',
  './birds/common-squirrel-cuckoo.jpg',
  './birds/common-tody-flycatcher.jpg',
  './birds/crimson-collared-tanager.jpg',
  './birds/dot-winged-antwren.jpg',
  './birds/dusky-antbird.jpg',
  './birds/eye-ringed-flatbill.jpg',
  './birds/ferruginous-pygmy-owl.jpg',
  './birds/fork-tailed-flycatcher.jpg',
  './birds/gartered-trogon.jpg',
  './birds/golden-hooded-tanager.jpg',
  './birds/golden-olive-woodpecker.jpg',
  './birds/gray-chested-dove.jpg',
  './birds/gray-crowned-yellowthroat.jpg',
  './birds/gray-headed-dove.jpg',
  './birds/gray-headed-tanager.jpg',
  './birds/great-black-hawk.jpg',
  './birds/great-tinamou.jpg',
  './birds/green-backed-sparrow.jpg',
  './birds/green-breasted-mango.jpg',
  './birds/green-honeycreeper.jpg',
  './birds/greenish-elaenia.jpg',
  './birds/groove-billed-ani.jpg',
  './birds/hook-billed-kite.jpg',
  './birds/ivory-billed-woodcreeper.jpg',
  './birds/keel-billed-toucan.jpg',
  './birds/king-vulture.jpg',
  './birds/laughing-falcon.jpg',
  './birds/lesser-greenlet.jpg',
  './birds/lesser-swallow-tailed-swift.jpg',
  './birds/lesser-yellow-headed-vulture.jpg',
  './birds/lessons-motmot.jpg',
  './birds/lineated-woodpecker.jpg',
  './birds/little-tinamou.jpg',
  './birds/long-billed-gnatwren.jpg',
  './birds/long-billed-hermit.jpg',
  './birds/mangrove-swallow.jpg',
  './birds/mangrove-vireo.jpg',
  './birds/masked-tityra.jpg',
  './birds/mayan-antthrush.jpg',
  './birds/mealy-amazon.jpg',
  './birds/melodious-blackbird.jpg',
  './birds/montezuma-oropendola.jpg',
  './birds/morelets-seedeater.jpg',
  './birds/mottled-owl.jpg',
  './birds/northern-barred-woodcreeper.jpg',
  './birds/northern-bentbill.jpg',
  './birds/northern-jacana.jpg',
  './birds/northern-plain-xenops.jpg',
  './birds/northern-potoo.jpg',
  './birds/northern-schiffornis.jpg',
  './birds/northern-tropical-pewee.jpg',
  './birds/ochre-bellied-flycatcher.jpg',
  './birds/ochre-crowned-greenlet.jpg',
  './birds/olivaceous-woodcreeper.jpg',
  './birds/olive-backed-euphonia.jpg',
  './birds/olive-throated-parakeet.jpg',
  './birds/orange-billed-sparrow.jpg',
  './birds/orange-breasted-falcon.jpg',
  './birds/ornate-hawk-eagle.jpg',
  './birds/pale-billed-woodpecker.jpg',
  './birds/pale-vented-pigeon.jpg',
  './birds/plain-breasted-ground-dove.jpg',
  './birds/purple-crowned-fairy.jpg',
  './birds/red-capped-manakin.jpg',
  './birds/red-crowned-ant-tanager.jpg',
  './birds/red-legged-honeycreeper.jpg',
  './birds/red-throated-ant-tanager.jpg',
  './birds/ruddy-crake.jpg',
  './birds/ruddy-ground-dove.jpg',
  './birds/ruddy-woodcreeper.jpg',
  './birds/rufous-breasted-spinetail.jpg',
  './birds/rufous-capped-warbler.jpg',
  './birds/rufous-tailed-hummingbird.jpg',
  './birds/rufous-tailed-jacamar.jpg',
  './birds/russet-naped-wood-rail.jpg',
  './birds/rusty-sparrow.jpg',
  './birds/scaly-breasted-hummingbird.jpg',
  './birds/scrub-euphonia.jpg',
  './birds/short-billed-pigeon.jpg',
  './birds/slate-headed-tody-flycatcher.jpg',
  './birds/slaty-tailed-trogon.jpg',
  './birds/smoky-brown-woodpecker.jpg',
  './birds/social-flycatcher.jpg',
  './birds/southern-house-wren.jpg',
  './birds/spot-breasted-wren.jpg',
  './birds/stripe-throated-hermit.jpg',
  './birds/stub-tailed-spadebill.jpg',
  './birds/tawny-winged-woodcreeper.jpg',
  './birds/tody-motmot.jpg',
  './birds/tropical-mockingbird.jpg',
  './birds/tropical-royal-flycatcher.jpg',
  './birds/variable-seedeater.jpg',
  './birds/vauxs-swift.jpg',
  './birds/violet-sabrewing.jpg',
  './birds/wedge-billed-woodcreeper.jpg',
  './birds/wedge-tailed-sabrewing.jpg',
  './birds/white-bellied-emerald.jpg',
  './birds/white-bellied-wren.jpg',
  './birds/white-breasted-wood-wren.jpg',
  './birds/white-browed-gnatcatcher.jpg',
  './birds/white-collared-manakin.jpg',
  './birds/white-collared-swift.jpg',
  './birds/white-crowned-parrot.jpg',
  './birds/white-hawk.jpg',
  './birds/white-necked-jacobin.jpg',
  './birds/white-necked-puffbird.jpg',
  './birds/white-whiskered-puffbird.jpg',
  './birds/yellow-bellied-elaenia.jpg',
  './birds/yellow-bellied-flycatcher.jpg',
  './birds/yellow-bellied-tyrannulet.jpg',
  './birds/yellow-billed-cacique.jpg',
  './birds/yellow-faced-grassquit.jpg',
  './birds/yellow-olive-flatbill.jpg',
  './birds/yellow-tailed-oriole.jpg',
  './birds/yellow-throated-euphonia.jpg',
  './birds/yellow-winged-tanager.jpg',
];

// Install event - pre-cache everything
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing... Pre-caching all ~147 bird images + app');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Cache shell assets
        console.log('[Service Worker] Caching app shell...');
        await cache.addAll(SHELL_ASSETS).catch((err) => {
          console.warn('[Service Worker] Error caching shell:', err.message);
        });
        
        // Cache bird images in batches to avoid overwhelming the system
        console.log('[Service Worker] Caching 147 bird images (~36MB)...');
        const batchSize = 15;
        for (let i = 0; i < BIRD_IMAGES.length; i += batchSize) {
          const batch = BIRD_IMAGES.slice(i, i + batchSize);
          
          const results = await Promise.allSettled(
            batch.map((url) => cache.add(url))
          );
          
          // Log progress
          const cached = Math.min(i + batchSize, BIRD_IMAGES.length);
          const successCount = results.filter((r) => r.status === 'fulfilled').length;
          console.log(
            `[Service Worker] Cached ${cached}/${BIRD_IMAGES.length} images (${successCount}/${batch.length} in batch)`
          );
        }
        
        console.log('[Service Worker] Installation complete! Ready for offline use in Belize');
        self.skipWaiting();
      } catch (error) {
        console.error('[Service Worker] Installation failed:', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter((name) => name !== CACHE_NAME);
        
        await Promise.all(
          oldCaches.map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        
        await self.clients.claim();
        console.log('[Service Worker] Ready! All resources cached offline');
      } catch (error) {
        console.error('[Service Worker] Activation failed:', error);
      }
    })()
  );
});

// App shell (HTML, JS, CSS) uses network-first so deploys and data updates are picked up.
// Bird images and other static assets use cache-first for offline field use.
function isAppShellRequest(request) {
  if (request.mode === 'navigate') return true;

  const url = new URL(request.url);
  const path = url.pathname;

  return (
    path.endsWith('.html') ||
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.includes('/assets/')
  );
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(() => {});
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone()).catch(() => {});
  }
  return networkResponse;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        if (isAppShellRequest(request)) {
          return networkFirst(request);
        }
        return cacheFirst(request);
      } catch (error) {
        console.log('[Service Worker] Offline - no cache:', request.url);

        if (request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#e5e7eb" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="10" font-family="system-ui">Offline</text></svg>',
            {
              headers: { 'Content-Type': 'image/svg+xml' },
              status: 200,
            }
          );
        }

        throw error;
      }
    })()
  );
});

// Handle messages from app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))));
  }
});
