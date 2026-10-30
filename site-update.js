/* QPJB — mise à jour automatique depuis GitHub Pages.
   Aucune version à incrémenter lors des publications : les validations HTTP
   (ETag/Last-Modified) des ressources de production servent de référence. */
(function () {
  'use strict';

  if (location.protocol === 'file:') return;

  const BASE = '/QPJB/';
  const WATCH = [
    'index.html',
    'service-worker.js',
    'catalogue.json',
    'config.json',
    'entrainement/qp-training-corrige.html',
    'entrainement/index.html',
    'entrainement/training-app.js',
    'entrainement/training-core.css',
    'entrainement/training-integrated.css',
    'entrainement/training-data.js',
    'entrainement/training-data-v743-corrige.js'
  ];
  const BASELINE_KEY = 'qpjb-site-signatures-v1';
  const RELOAD_KEY = 'qpjb-site-reloaded-signatures-v1';
  const CHECK_EVERY_MS = 60000;
  const REQUEST_TIMEOUT_MS = 8000;
  let checking = false;
  let previous = null;

  function storageGet(key) {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  }
  function storageSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (_) {}
  }
  function savedBaseline() {
    try {
      const parsed = JSON.parse(storageGet(BASELINE_KEY) || 'null');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch (_) { return null; }
  }

  async function versionOf(path) {
    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);
    try {
      // HEAD évite de télécharger à chaque contrôle les 2 Mo de données de jeu.
      // La requête n'est pas interceptée par notre service worker (GET seulement).
      const response = await fetch(BASE + path, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      if (!response.ok) return null;
      const etag = response.headers.get('etag');
      const modified = response.headers.get('last-modified');
      const length = response.headers.get('content-length') || '';
      const fingerprint = etag ? 'etag:' + etag :
        modified ? 'modified:' + modified + '|length:' + length : '';
      return fingerprint ? [path, fingerprint, modified] : null;
    } catch (_) {
      return null; // Réseau indisponible : pas de rechargement intempestif.
    } finally {
      clearTimeout(timer);
    }
  }

  async function checkForUpdate() {
    if (checking || document.hidden || navigator.onLine === false) return;
    checking = true;
    try {
      const responses = await Promise.all(WATCH.map(versionOf));
      const available = responses.filter(Boolean);
      // Évite toute décision sur la base d'une réponse partielle du CDN.
      if (available.length < 5) return;
      const current = Object.fromEntries(available.map(function (item) {
        return [item[0], item[1]];
      }));
      const baseline = previous || savedBaseline();
      let changed = Boolean(baseline && Object.keys(current).some(function (path) {
        return baseline[path] && baseline[path] !== current[path];
      }));

      if (!baseline) {
        // Si le HTML chargé est déjà périmé au premier contrôle,
        // comparer sa date réelle à celle du fichier publié.
        const indexInfo = available.find(function (item) { return item[0] === 'index.html'; });
        const loadedAt = Date.parse(document.lastModified || '');
        const serverAt = Date.parse(indexInfo && indexInfo[2] || '');
        if (Number.isFinite(loadedAt) && loadedAt > 1577836800000 &&
            Number.isFinite(serverAt) && serverAt - loadedAt > 2000) changed = true;
      }

      previous = Object.assign({}, baseline || {}, current);
      storageSet(BASELINE_KEY, JSON.stringify(previous));

      if (!changed) return;
      const revision = JSON.stringify(current);
      if (storageGet(RELOAD_KEY) === revision) return;
      storageSet(RELOAD_KEY, revision);

      // Actualise le SW si sa publication a changé, puis recharge. Le SW
      // force une récupération réseau des HTML/CSS/JS/JSON QPJB.
      try {
        if (navigator.serviceWorker) {
          const registration = await navigator.serviceWorker.getRegistration(BASE);
          if (registration) await registration.update();
        }
      } catch (_) {}
      location.reload();
    } finally {
      checking = false;
    }
  }

  // Contrôle à l'ouverture, toutes les 60 s tant que l'onglet est visible,
  // au retour sur l'onglet et au rétablissement du réseau.
  checkForUpdate();
  setInterval(checkForUpdate, CHECK_EVERY_MS);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) checkForUpdate();
  });
  window.addEventListener('focus', checkForUpdate);
  window.addEventListener('online', checkForUpdate);
})();