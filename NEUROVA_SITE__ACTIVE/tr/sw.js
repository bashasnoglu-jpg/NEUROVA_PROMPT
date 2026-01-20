const CACHE_NAME = 'neurova-v3-tr-scope';
const ASSETS = [
  './index.html',
  './hamam.html',
  './masajlar.html',
  './about.html',
  './404.html',
  './offline.html',
  '../assets/css/style.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('tr/offline.html');
        }
      });
    })
  );
});

