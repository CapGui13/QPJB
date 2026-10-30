/* QPJB — contrôle léger des versions publiées par GitHub Pages.
   Une requête vers un fichier statique local au lieu de l'API GitHub. */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;

  // Ce fichier est régénéré après chaque mise à jour du dépôt,
  // puis publié sur le même domaine que l'application (sans quota API).
  const URL = '/QPJB/site-version.json';
  const VERSION_KEY = 'qpjb-pages-release-v2';
  const RELOAD_KEY = 'qpjb-pages-reloaded-v2';
  const AUTO_RELOAD_KEY = 'qpjb-auto-refresh';
  const CHECK_MS = 180000;
  const MIN_GAP_MS = 60000;
  let checking = false;
  let activating = false;
  let lastCheck = -MIN_GAP_MS;
  let pending = null;

  function get(key) {
    try { return sessionStorage.getItem(key); } catch (_) { return null; }
  }
  function set(key, value) {
    try { sessionStorage.setItem(key, value); } catch (_) {}
  }
  function inExercise() {
    return !!document.body?.classList.contains('qpjb-training-in-quiz');
  }

  async function publishedRevision() {
    const abort = new AbortController();
    const watchdog = setTimeout(() => abort.abort(), 8000);
    try {
      const response = await fetch(URL, {cache: 'no-store', signal: abort.signal});
      if (!response.ok) return null;
      const payload = await response.json();
      const revision = payload && payload.revision;
      return typeof revision === 'string' && /^[a-f0-9]{40}$/i.test(revision)
        ? revision.toLowerCase() : null;
    } catch (_) {
      return null; // hors ligne : conserver le contenu et la progression
    } finally {
      clearTimeout(watchdog);
    }
  }

  async function activate(revision) {
    if (activating || !revision || inExercise()) {
      if (revision) pending = revision;
      return;
    }
    if (get(RELOAD_KEY) === revision) { pending = null; return; }
    activating = true;
    pending = null;
    set(RELOAD_KEY, revision);
    set(VERSION_KEY, revision);
    set(AUTO_RELOAD_KEY, '1'); // permet de restaurer l'écran en cours
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration('/QPJB/');
        if (registration) await registration.update();
      }
    } catch (_) {}
    // Le service worker charge HTML/CSS/JS/JSON en réseau d'abord (no-store).
    try { location.reload(); }
    finally { activating = false; }
  }

  async function check() {
    if (activating || document.hidden || navigator.onLine === false) return;
    if (pending && !inExercise()) { await activate(pending); return; }
    const now = Date.now();
    if (checking || now - lastCheck < MIN_GAP_MS) return;
    checking = true;
    lastCheck = now;
    try {
      const revision = await publishedRevision();
      if (!revision) return;
      const previous = get(VERSION_KEY);
      if (!previous) { set(VERSION_KEY, revision); return; }
      if (previous !== revision) {
        pending = revision;
        if (!inExercise()) await activate(revision);
      }
    } finally {
      checking = false;
    }
  }

  check();
  setInterval(check, CHECK_MS);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) check();
  });
  window.addEventListener('focus', check);
  window.addEventListener('online', check);
  window.addEventListener('qpjb-training-safe-update', check);
})();
