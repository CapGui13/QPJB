// QPJB — ressources essentielles disponibles sans réseau après la première installation.
// Le cache dynamique reste réseau-d'abord afin que les documents et séances publiés
// soient actualisés dès qu'une connexion est disponible.
const CACHE = 'qpjb-v11';
const BASE = '/QPJB/';
const TRAINING_SHELL = [
  BASE,
  BASE + 'manifest.json?v=8',
  BASE + 'qpjb-logo-fixed.svg?v=1',
  BASE + 'qpjb-design-tokens.css?v=20261029e',
  BASE + 'entrainement/',
  BASE + 'entrainement/training-core.css?v=20261030f',
  BASE + 'entrainement/training-integrated.css?v=20261030b',
  BASE + 'entrainement/training-data.js?v=20261029p',
  BASE + 'entrainement/training-app.js?v=20261030f'
];
// Ces fac-similés sont petits mais indispensables quand un exercice est ouvert
// hors ligne pour la première fois. Conserver les 23 fichiers, sans retoucher
// le PDF ou le contenu pédagogique.
const TRAINING_FACSIMILES = Array.from({length:23}, (_,i)=>
  BASE + 'entrainement/assets/JC-' + String(i+1).padStart(3,'0') + '.webp'
);
const PRECACHE = [...TRAINING_SHELL,...TRAINING_FACSIMILES];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    // Ne pas activer une nouvelle version avec une moitié de parcours manquante.
    const cache = await caches.open(CACHE);
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys())
      .filter(key => key.startsWith('qpjb-') && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      request.cache === 'no-store') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, {signal: AbortSignal.timeout(6500)});
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      if (cached) return cached;
      // La page intégrée contient mode et rev dans sa query string : elle doit
      // pouvoir s'ouvrir hors ligne même si ce mode n'a jamais été visité.
      if (request.mode === 'navigate' &&
          (url.pathname === BASE + 'entrainement/' ||
           url.pathname === BASE + 'entrainement/index.html')) {
        const shell = await cache.match(BASE + 'entrainement/');
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
