const CACHE_NAME = "Smartbook-v1";

const urlsToCache = [
  "./",
  "./index.html",          // utile si tu ouvres directement l’URL racine du repo
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

// 📦 INSTALLATION : mise en cache initiale
self.addEventListener("install", (event) => {
  console.log("📦 Mise en cache initiale...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // 👉 prend la main tout de suite
});

// 🧹 ACTIVATION : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  console.log("⚙️ Activation du service worker...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑️ Suppression de l’ancien cache :", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // 👉 contrôle direct des pages ouvertes
});

// 🌍 FETCH : répondre avec le cache puis fallback réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne la réponse du cache si dispo, sinon fait un vrai fetch
      return response || fetch(event.request);
    })
  );
});
