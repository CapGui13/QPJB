const CACHE = 'qpjb-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => clients.claim());
self.addEventListener('fetch', e => {
  // Cache-first pour les assets locaux, network pour le reste
  if (e.request.url.includes('api.github.com') || e.request.url.includes('raw.githubusercontent.com')) {
    return; // laisser passer sans cache
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
