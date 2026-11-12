// Offline cache for تحدي الشلة (build mwdavds0).
const CACHE = 'shella-mwdavds0';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  // The Android app file always comes fresh from the server (never from this cache).
  if (e.request.method !== 'GET' || /\.apk$/.test(new URL(e.request.url).pathname)) return;
  if (e.request.mode === 'navigate') {
    const net = fetch(e.request).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('index.html', copy)); } return res; });
    const slow = new Promise((r) => setTimeout(r, 4000)).then(() => caches.match('index.html'));
    e.respondWith(Promise.race([net, slow]).then((res) => res || net).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('index.html'))));
});
