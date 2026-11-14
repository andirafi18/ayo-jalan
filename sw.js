const CACHE_NAME = 'ayo-jalan-v3';
const ASSETS_TO_CACHE = ['./', './index.html', './driver.html', './admin.html', './ayo-jalan-core.js', './manifest.json', './manifest-driver.json'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS_TO_CACHE))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => { if (e.request.method === 'GET') e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); });
