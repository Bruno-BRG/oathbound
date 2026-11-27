/* Oathbound service worker: offline app shell.
   Keep VERSION equal to OB.BUILD in js/app.js. Change both on every release. */
const VERSION = 'ob-2026-11-27.hf3';
const ASSETS = '?v=2026-11-27.hf3';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/data.js', 'js/assets-data.js', 'js/core.js', 'js/engine.js', 'js/icons.js', 'js/ui.js',
  'js/view-character.js', 'js/view-challenges.js', 'js/view-campaign.js', 'js/view-guide.js',
  'js/view-moves.js', 'js/view-oracles.js', 'js/view-log.js', 'js/drawer.js', 'js/dice3d.js', 'js/app.js',
  'assets/vendor/three-dice.js', 'assets/map.jpg',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/maskable-512.png', 'assets/icons/apple-touch-icon.png',
  'assets/fonts/archivo-black-latin-400-normal.woff2',
  'assets/fonts/barlow-condensed-latin-600-normal.woff2', 'assets/fonts/barlow-condensed-latin-700-normal.woff2',
  'assets/fonts/crimson-text-latin-400-italic.woff2', 'assets/fonts/crimson-text-latin-400-normal.woff2', 'assets/fonts/crimson-text-latin-600-normal.woff2', 'assets/fonts/crimson-text-latin-700-normal.woff2',
  'assets/fonts/lato-latin-400-normal.woff2', 'assets/fonts/lato-latin-700-normal.woff2', 'assets/fonts/lato-latin-900-normal.woff2'
].map(u => (/\.(js|css)$/.test(u) ? u + ASSETS : u));

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const fresh = req.mode === 'navigate' || /\.(html|js|css|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (fresh) {
    // network first: new code wins when online, cache when offline
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
  } else {
    // cache first: images and fonts do not change
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
