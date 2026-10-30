/* QPJB — contrôle léger des publications réellement réussies sur GitHub Pages.
   Une seule requête périodique au lieu de sonder 11 ressources. */
(function () {
  'use strict';
  if (location.protocol === 'file:') return;

  // Pages build and deployment : identifiant du workflow natif de ce dépôt.
  // En consultant les exécutions du dépôt on évite de confondre un commit non
  // déployé (notamment celui d'un bot) avec une nouvelle version publique.
  const URL = 'https://api.github.com/repos/CapGui13/QPJB/actions/runs?per_page=8';
  const VERSION_KEY = 'qpjb-pages-release-v1';
  const RELOAD_KEY = 'qpjb-pages-reloaded-v1';
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
      const response = await fetch(URL, {
        cache: 'no-store',
        headers: {'Accept': 'application/vnd.github+json'},
        signal: abort.signal
      });
      if (!response.ok) return null; // y compris limitation de débit de l'API
      const payload = await response.json();
      const pages = Array.isArray(payload.workflow_runs) ?
        payload.workflow_runs.find(run => run.name === 'pages build and deployment' &&
          run.conclusion === 'success' && /^[a-f0-9]{40}$/i.test(run.head_sha || '')) : null;
      return pages ? pages.head_sha.toLowerCase() : null;
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
    location.reload();
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
