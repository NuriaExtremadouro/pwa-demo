const CACHE_NAME = 'pwa-demo';
const urlsToCache = [
  '/'
];

// Wait until the SW is installed and cache our URLs 
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Wait until the SW is activated to update it and delete our old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle our requests to try to pull from the cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request) // Check if the request was cached previously
      .then((response) => {
        if (response) {
          return response; // If it was, return the cached response
        }
        return fetch(event.request); // If it wasn't do the fetch
      }
    )
  );
});
