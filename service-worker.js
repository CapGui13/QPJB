// Réseau d'abord, cache en secours ; les requêtes no-store ne sont pas interceptées.
const CACHE = 'qpjb-v3';

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys
      .filter(key => key.startsWith('qpjb-') && key !== CACHE)
      .map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      request.cache === 'no-store') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      // Hors ligne ou réseau instable : éviter une attente illimitée.
      const response = await fetch(request, {signal: AbortSignal.timeout(6500)});
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      throw error;
    }
  })());
});
