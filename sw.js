// Service Worker for ETI MCQ PWA
const CACHE_NAME = 'eti-mcq-v1';

// All pages and assets to cache for offline use
const ASSETS_TO_CACHE = [
  '/index.html',
  '/style.css',
  '/unit1.html',
  '/unit1nirali.html',
  '/unit1tech.html',
  '/unit2.html',
  '/unit2nirali.html',
  '/unit2tech.html',
  '/unit3.html',
  '/unit3nirali.html',
  '/unit3tech.html',
  '/unit4.html',
  '/unit4nirali.html',
  '/unit4tech.html',
  '/unit5.html',
  '/unit5nirali.html',
  '/unit5tech.html',
  '/manifest.json'
];

// Install: cache all assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching all pages');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Serve from cache (works offline)
      }
      return fetch(event.request).then((networkResponse) => {
        // Optionally cache new requests dynamically
        return networkResponse;
      }).catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
