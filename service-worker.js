// QPJB — ressources essentielles disponibles sans réseau après la première installation.
// Le cache dynamique reste réseau-d'abord afin que les documents et séances publiés
// soient actualisés dès qu'une connexion est disponible.
const CACHE = 'qpjb-v39';
const BASE = '/QPJB/';
const TRAINING_SHELL = [
  BASE,
  BASE + 'site-update.js?v=1',
  BASE + 'manifest.json?v=8',
  BASE + 'qpjb-logo-fixed.svg?v=1',
  BASE + 'qpjb-design-tokens.css?v=20261029e',
  BASE + 'entrainement/',
  BASE + 'entrainement/qp-training-corrige.html',
  BASE + 'entrainement/training-core.css?v=20261030h',
  BASE + 'entrainement/training-integrated.css?v=20261030z',
  BASE + 'entrainement/training-data-bootstrap.js?v=20261030d1',
  BASE + 'entrainement/training-app.js?v=20261031a'
];
// Les modules pédagogiques volumineux ne doivent plus bloquer l'installation.
// Ils restent chargés à la demande et sont sauvegardés en arrière-plan
// pour que les deux espaces soient ensuite disponibles sans connexion.
const TRAINING_MODULES = [
  BASE + 'entrainement/training-data-bidding.js?v=20261030d1',
  BASE + 'entrainement/training-data-play.js?v=20261030d1'
];
// Ces fac-similés sont petits mais indispensables quand un exercice est ouvert
// hors ligne pour la première fois. Conserver les 23 fichiers, sans retoucher
// le PDF ou le contenu pédagogique.
const TRAINING_FACSIMILES = Array.from({length:23}, (_,i)=>
  BASE + 'entrainement/assets/JC-' + String(i+1).padStart(3,'0') + '.webp'
);
// L'installation ne récupère que le squelette, pas les ~1,1 Mo de QCM
// ni les 23 images d'origine. Ils seront téléchargés après l'affichage.
const BACKGROUND_TRAINING = [...TRAINING_MODULES, ...TRAINING_FACSIMILES];
let warmPromise = null;
async function cacheOfflineResources() {
  const cache = await caches.open(CACHE);
  for (const resource of BACKGROUND_TRAINING) {
    if (await cache.match(resource)) continue;
    const response = await fetch(resource, {cache: 'no-store'});
    if (!response.ok) throw new Error('Cache QPJB incomplet: ' + resource);
    await cache.put(resource, response);
  }
  return true;
}
self.addEventListener('message', event => {
  if (event.data?.type !== 'QPJB_PREFETCH_OFFLINE') return;
  if (!warmPromise) {
    warmPromise = cacheOfflineResources().catch(() => false).finally(() => {
      warmPromise = null;
    });
  }
  const task = warmPromise;
  event.waitUntil(task);
  // Permet aux tests de vérifier la fin du téléchargement sans minuterie.
  if (event.ports?.[0]) {
    event.waitUntil(task.then(ok => {
      try { event.ports[0].postMessage({type:'QPJB_OFFLINE_READY',ok}); } catch (_) {}
    }));
  }
});
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(TRAINING_SHELL);
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
      // Ne jamais réutiliser une ancienne réponse HTTP pour l'interface ou les exercices.
      const freshTraining = url.pathname === BASE || url.pathname === BASE + 'index.html' ||
        url.pathname.startsWith(BASE + 'entrainement/');
      // Un reload automatique doit récupérer des fichiers nouveaux, même quand
      // leurs URL ne contiennent pas de nouveau numéro de version.
      const freshCode = /\.(?:html?|css|js|json|webmanifest)$/i.test(url.pathname);
      const response = await fetch(request, {
        cache: freshTraining || freshCode ? 'no-store' : 'default',
        signal: AbortSignal.timeout(6500)
      });
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request) ||
        await cache.match(url.pathname, {ignoreSearch: true});
      if (cached) return cached;
      // Les images facultatives (vignettes des documents, logos secondaires)
      // peuvent ne pas avoir été vues avant la déconnexion. Ne pas laisser
      // le fetch rejeté produire une erreur JavaScript globale dans WebKit.
      if (request.destination === 'image' ||
          /\.(?:png|jpe?g|webp|gif|svg)$/i.test(url.pathname)) {
        return new Response(null, {status: 204});
      }
      // La page intégrée contient mode et rev dans sa query string : elle doit
      // pouvoir s'ouvrir hors ligne même si ce mode n'a jamais été visité.
      if (request.mode === 'navigate' &&
          (url.pathname === BASE + 'entrainement/' ||
           url.pathname === BASE + 'entrainement/index.html' ||
           url.pathname === BASE + 'entrainement/qp-training-corrige.html')) {
        const shell = await cache.match(BASE + 'entrainement/');
        if (shell) return shell;
      }
      throw error;
    }
  })());
});
