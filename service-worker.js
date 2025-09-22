const CACHE_NAME = "Smartbook-v5";

// Fichiers statiques + tous les MP3
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./Smartbook.html",
  "./lecteur.html",
  "./manifest.json",
  "./logo-icon-192.png",
  "./logo-icon-512.png",
  "./Couverture_resized.jpg",
  "./PLANCHE-1a.jpg",
  "./Logo_resized.jpg",
  "./lecteur.js",
  "./style.css",
  "./plyr.css",
  "./plyr.polyfilled.js",

  // 🎧 Toutes les pistes audio
  "./Introduction.mp3",
  "./Chapitre1-1.mp3",
  "./Chapitre1-2.mp3",
  "./Chapitre1-3.mp3",
  "./Chapitre2-1.mp3",
  "./Chapitre2-2.mp3",
  "./Chapitre2-3.mp3",
  "./Chapitre3-1.mp3",
  "./Chapitre3-2.mp3",
  "./Chapitre3-3.mp3",
  "./Chapitre4-1.mp3",
  "./Chapitre4-2.mp3",
  "./Chapitre4-3.mp3",
  "./Chapitre5-1.mp3",
  "./Chapitre5-2.mp3",
  "./Chapitre5-3.mp3",
  "./Chapitre6-1.mp3",
  "./Chapitre6-2.mp3",
  "./Chapitre6-3.mp3",
  "./Chapitre7-1.mp3",
  "./Chapitre7-2.mp3",
  "./Chapitre7-3.mp3",
  "./Chapitre8-1.mp3",
  "./Chapitre8-2.mp3",
  "./Chapitre8-3.mp3",
  "./Conclusion.mp3",

  // 📄 Annexes PDF
  "./Annexes.pdf",
  "./mentions_legales.pdf"
];

// 📦 INSTALLATION : mise en cache initiale
self.addEventListener("install", (event) => {
  console.log("📦 Mise en cache initiale…");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 🧹 ACTIVATION : nettoyage anciens caches
self.addEventListener("activate", (event) => {
  console.log("⚙️ Activation du service worker…");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// 🌍 FETCH : cache-first avec gestion spéciale des Range requests
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ⚡ Firefox : laisser passer les requêtes Range (audio/vidéo)
  if (req.headers.get("range")) {
    event.respondWith(fetch(req));
    return;
  }

  // Stratégie cache-first
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;

      return fetch(req).then((response) => {
        // Optionnel : mettre en cache les nouvelles ressources
        if (response && response.status === 200 && response.type === "basic") {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, respClone);
          });
        }
        return response;
      });
    })
  );
});
