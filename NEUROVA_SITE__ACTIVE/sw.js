// NEUROVA SW — SAFE FETCH v2
const CACHE_NAME = "neurova-cache-v2";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // SADECE GET
  if (event.request.method !== "GET") return;

  event.respondWith((async () => {
    // 1) Önce network dene
    try {
      const networkResponse = await fetch(event.request);

      // 2) Cache'e yazmayı dene (hata olursa ignore)
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, networkResponse.clone());
      } catch (_) {}

      return networkResponse;
    } catch (_) {
      // 3) Network patlarsa cache'den dönmeyi dene
      try {
        const cached = await caches.match(event.request);
        if (cached) return cached;
      } catch (_) {}

      // 4) Fallback
      return new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  })());
});
