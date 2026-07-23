const CACHE_NAME = "mokkan-v26-english-journal-tabs";
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
  "./assets/smooth/mokkan-render-dining-table-smooth.jpg",
  "./assets/smooth/mokkan-render-desk-smooth.jpg",
  "./assets/smooth/mokkan-render-side-table-smooth.jpg",
  "./assets/smooth/mokkan-making-lounge-chair-smooth.jpg",
  "./assets/smooth/portfolio-wooden-lounge-chair-render-smooth.jpg",
  "./assets/smooth/portfolio-curved-cabinet-render-smooth.jpg",
  "./assets/smooth/portfolio-shelf-table-render-smooth.jpg",
  "./assets/smooth/portfolio-dark-wood-armchair-table-render-smooth.jpg",
  "./assets/smooth/daily-trends-2026-07-12-smooth.jpg",
  "./assets/smooth/journal-dining-table-guide-smooth.jpg",
  "./assets/smooth/journal-mortise-tenon-smooth.jpg",
  "./assets/smooth/mokkan-maker-kang-junyoung-smooth.jpg"
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
