const CACHE_NAME = "qr-supermercado-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./medianos.html",
  "./grandes.html",
  "./manifest.webmanifest",
  "./service-worker.js",
  "./js/jsqr.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Instala y cachea
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activa y limpia caches viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Cache-first (offline-friendly)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((resp) => {
          // opcional: cache dinámico de nuevas cosas
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return resp;
        }).catch(() => cached)
      );
    })
  );
});