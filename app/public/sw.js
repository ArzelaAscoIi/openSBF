const CACHE_NAME = 'opensbf-v1';

const PRECACHE_URLS = [
  '/',
  '/binnen',
  '/see',
  '/navigation',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        // Cache successful HTML and static asset responses
        if (
          response.ok &&
          (event.request.destination === 'document' ||
            event.request.destination === 'script' ||
            event.request.destination === 'style' ||
            event.request.destination === 'image' ||
            event.request.destination === 'font')
        ) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        // Offline fallback: return cached root for navigation requests
        if (event.request.destination === 'document') {
          const fallback = await cache.match('/');
          if (fallback) return fallback;
        }
        return new Response('Offline', { status: 503 });
      }
    })
  );
});
