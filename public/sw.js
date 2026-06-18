// Service Worker for Arshan Portfolio PWA
const CACHE_NAME = 'arshan-portfolio-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/favicon.svg',
  '/assets/arshan.webp',
  '/assets/hero-portrait.jpg',
  '/assets/pixel-sprout.png',
  '/assets/soil-texture.jpg',
  '/assets/eda_plot.png',
  '/assets/model_train.png',
  '/assets/model_eval.png',
  '/assets/deployment.png',
  '/assets/hackathon_trophy.png',
  '/assets/data_analysis.png',
  '/assets/ai_network.png',
];

// Install event — pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline', { status: 503 });
        });
      })
  );
});
