const CACHE_NAME = "Smartbook-v1";

const urlsToCache = [
  "./",
  "./Smartbook.html",
  "./lecteur.html",
  "./manifest.json",
  "./logo-icon-192.png",
  "./logo-icon-512.png",
  "./Couverture_resized.jpg",
  "./PLANCHE-1a.jpg",
  "./Logo_resized.jpg",
  "./lecteur.js",
  "./style.css"
];

// 📦 INSTALLATION
self.addEventListener("install", (event) => {
  console.log("📦 Mise en cache initiale...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(err => console.error("Erreur cache :", err))
  );
  self.skipWaiting();
});

// 🧹 ACTIVATION
self.addEventListener("activate", (event) => {
  console.log("⚙️ Activation du service worker...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// 🌍 FETCH
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) =>
      response || fetch(event.request)
    )
  );
});
