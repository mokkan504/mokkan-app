const CACHE_NAME = "mokkan-v21-sharp-home-images";
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
  "./birthdate.js",
  "./phone-input.js",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./assets/mokkan-logo.png",
  "./assets/mokkan-render-dining-table.png",
  "./assets/mokkan-render-desk.png",
  "./assets/mokkan-render-side-table.png",
  "./assets/mokkan-making-lounge-chair.png",
  "./assets/portfolio-wooden-lounge-chair-render.png",
  "./assets/portfolio-curved-cabinet-render.png",
  "./assets/portfolio-shelf-table-render.png",
  "./assets/portfolio-dark-wood-armchair-table-render.png",
  "./assets/mokkan-about-workshop.png",
  "./assets/daily-trends-2026-07-12.png",
  "./assets/journal-dining-table-guide.png",
  "./assets/journal-mortise-tenon.png",
  "./assets/sharp/mokkan-render-dining-table-sharp.jpg",
  "./assets/sharp/mokkan-render-desk-sharp.jpg",
  "./assets/sharp/mokkan-render-side-table-sharp.jpg",
  "./assets/sharp/mokkan-making-lounge-chair-sharp.jpg",
  "./assets/sharp/portfolio-wooden-lounge-chair-render-sharp.jpg",
  "./assets/sharp/portfolio-curved-cabinet-render-sharp.jpg",
  "./assets/sharp/portfolio-shelf-table-render-sharp.jpg",
  "./assets/sharp/portfolio-dark-wood-armchair-table-render-sharp.jpg",
  "./assets/sharp/daily-trends-2026-07-12-sharp.jpg",
  "./assets/sharp/journal-dining-table-guide-sharp.jpg",
  "./assets/sharp/journal-mortise-tenon-sharp.jpg",
  "./assets/sharp/mokkan-maker-kang-junyoung-sharp.jpg"
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
