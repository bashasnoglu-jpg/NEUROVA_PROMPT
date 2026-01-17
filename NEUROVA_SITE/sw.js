const CACHE_NAME = 'neurova-site-v3';

const CORE_ASSETS = [
  './tr/offline.html',
  './en/offline.html',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    (async () => {
      try {
        if (req.method !== 'GET') return await fetch(req);
        return await fetch(req);
      } catch (_err) {
        if (req.mode === 'navigate') {
          const p = new URL(req.url).pathname.toLowerCase();
          const offline = p.includes('/en/') ? './en/offline.html' : './tr/offline.html';
          const res = await caches.match(offline);
          return res || new Response('Offline', { status: 503 });
        }
        const cached = await caches.match(req);
        return cached || Response.error();
      }
    })()
  );
});
