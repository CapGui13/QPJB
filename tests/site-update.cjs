'use strict';
// Test isolé du rafraîchissement automatique, sans dépendance Playwright.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'site-update.js'), 'utf8');
const storage = new Map();
const events = {};
const versions = new Map();
const queried = [];
let interval;
let reloads = 0;
let serviceWorkerUpdates = 0;
let online = true;
let hidden = false;
const date = 'Fri, 30 Oct 2026 18:00:00 GMT';

function tick() {
  return new Promise(resolve => setImmediate(() => setImmediate(resolve)));
}

const context = {
  location: {protocol: 'https:', reload() { reloads++; }},
  window: {addEventListener(name, callback) { events[name] = callback; }},
  document: {
    get hidden() { return hidden; },
    lastModified: date,
    addEventListener(name, callback) { events[name] = callback; }
  },
  navigator: {
    get onLine() { return online; },
    serviceWorker: {
      async getRegistration(scope) {
        assert.equal(scope, '/QPJB/');
        return {async update() { serviceWorkerUpdates++; }};
      }
    }
  },
  sessionStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); }
  },
  fetch: async (url, options) => {
    assert.equal(options.method, 'HEAD');
    assert.equal(options.cache, 'no-store');
    queried.push(url);
    const file = url.replace('/QPJB/', '');
    if (!versions.has(file)) versions.set(file, 'v1');
    return {
      ok: true,
      headers: {
        get(name) {
          if (name === 'etag') return '"' + versions.get(file) + '"';
          if (name === 'last-modified') return date;
          if (name === 'content-length') return '123';
          return null;
        }
      }
    };
  },
  AbortController,
  setTimeout,
  clearTimeout,
  setInterval(callback, ms) {
    assert.equal(ms, 60000);
    interval = callback;
    return 1;
  },
  console
};

(async () => {
  vm.runInNewContext(code, context, {filename: 'site-update.js'});
  await tick();
  assert.equal(reloads, 0, 'The first check creates a baseline, not a reload');
  assert(queried.some(url => url.endsWith('entrainement/training-app.js')));
  assert(queried.some(url => url.endsWith('entrainement/training-data-v743-corrige.js')));
  versions.set('entrainement/training-app.js', 'v2');
  events.focus();
  await tick();
  assert.equal(reloads, 1, 'A changed deployed script triggers an automatic reload');
  assert.equal(serviceWorkerUpdates, 1, 'The service worker is refreshed');
  events.focus();
  await tick();
  assert.equal(reloads, 1, 'The same revision never creates a reload loop');
  versions.set('index.html', 'v3');
  interval();
  await tick();
  assert.equal(reloads, 2, 'A subsequent site release triggers another reload');
  online = false;
  versions.set('entrainement/training-core.css', 'v4');
  events.focus();
  await tick();
  assert.equal(reloads, 2, 'No reload when offline');
  online = true;
  hidden = true;
  events.visibilitychange();
  await tick();
  assert.equal(reloads, 2, 'No reload in a hidden tab');
  hidden = false;
  events.visibilitychange();
  await tick();
  assert.equal(reloads, 3, 'A return to the tab detects an update');
  console.log(JSON.stringify({result: 'PASS',checks: queried.length,reloads,serviceWorkerUpdates}));
})().catch(err => {console.error(err);process.exitCode = 1;});
