var CACHE_NAME = 'mulai-kerja-v2';
var urlsToCache = [
  '/teknisi-app/',
  '/teknisi-app/index.html',
  '/teknisi-app/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.30.0/dist/tabler-icons.min.css'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

function isApiRequest(url) {
  return url.indexOf('script.google.com') !== -1;
}

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  if (isApiRequest(url)) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(function() {
        return new Response('', { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
