/* App-shell cache so the app opens instantly and shows a page when offline. Family data is never cached here. */
const CACHE = 'family-tree-shell-v16';
const SHELL = ['./', 'index.html', 'supabase.js', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-180.png', 'fonts/tajawal-arabic-400-normal.woff2', 'fonts/tajawal-arabic-500-normal.woff2', 'fonts/tajawal-arabic-700-normal.woff2', 'fonts/tajawal-arabic-800-normal.woff2', 'fonts/tajawal-latin-400-normal.woff2', 'fonts/tajawal-latin-500-normal.woff2', 'fonts/tajawal-latin-700-normal.woff2', 'fonts/tajawal-latin-800-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== location.origin) return;           // API calls go straight to the network
  e.respondWith(fetch(e.request).then(r => { if(r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
