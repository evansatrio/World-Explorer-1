/**
 * Service Worker for World Country Guessing Game.
 *
 * Strategy:
 *  - Pre-cache the app shell (index.html, manifest, icons) so the page loads on
 *    repeat visits even with flaky connectivity.
 *  - Network-first for everything else (Leaflet/Turf CDN, GeoJSON, REST Countries
 *    API), falling back to cache when offline. The game still requires internet
 *    on first launch to populate caches.
 */
const CACHE_VERSION = 'world-quiz-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/icon-180.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // Cache successful responses (best-effort)
        if (res && res.status === 200 && res.type !== 'opaqueredirect') {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
