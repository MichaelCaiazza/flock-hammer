// Minimal service worker: required for Chrome's "install app" (adds to home screen as a real app).
// Network-first so the map and data always try for the freshest version, falling back to cache offline.
const CACHE = 'flock-hammer-v1';
const CORE = ['./', './index.html', './stats.html', './manifest.webmanifest',
  './assets/icon-192.png', './assets/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  e.respondWith(
    fetch(request).then(res => {
      if (res.ok && request.url.startsWith(self.location.origin)) {
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy));
      }
      return res;
    }).catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
  );
});
