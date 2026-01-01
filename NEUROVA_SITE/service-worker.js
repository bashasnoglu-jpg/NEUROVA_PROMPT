const CACHE_VERSION = 'v10'; // Bump version to force update
const ASSETS_CACHE = `assets-${CACHE_VERSION}`;
const HTML_CACHE = `html-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    // Use relative path for offline.html
    caches.open(HTML_CACHE).then((cache) => cache.addAll(['offline.html']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== ASSETS_CACHE && key !== HTML_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // This is the most important guard.
  // Ignore non-GET requests and requests that are not for HTTP/HTTPS.
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  const isHTML =
    request.mode === 'navigate' ||
    request.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    // For HTML, use a network-first strategy.
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If the network request is successful, cache a copy.
          if (response.ok) {
            const copy = response.clone();
            caches.open(HTML_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          // If the network fails, try to serve from the cache.
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          // If the request is not in the cache, serve the offline fallback page.
          // Use relative path here too.
          return caches.match('offline.html');
        })
    );
    return;
  }

  // For assets, use a cache-first strategy.
  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached response if found.
      if (cached) {
        return cached;
      }

      // Otherwise, fetch from the network.
      return fetch(request).then((response) => {
        // Only cache valid, successful, same-origin responses.
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(ASSETS_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
