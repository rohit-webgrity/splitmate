const CACHE_NAME = 'splitmate-v1';
const ASSETS = [
  '/app',
  '/src/css/main.css',
  '/src/js/app.js',
  '/public/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Network-first for Firebase/API calls
  if (url.origin.includes('firestore.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for local assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});