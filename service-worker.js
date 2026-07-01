const CACHE_NAME = "mokkan-v12-admin-columns";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./cart.js",
  "./auth.js",
  "./pwa.js",
  "./supabase-config.js",
  "./backend.js",
  "./analytics.js",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./assets/mokkan-logo.png",
  "./assets/mokkan-render-dining-table.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match("./index.html"));

      return cached || network;
    })
  );
});
