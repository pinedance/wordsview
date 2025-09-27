const CACHE_NAME = 'wordsview-v1';
const FONT_CACHE_NAME = 'wordsview-fonts-v1';
const IMAGE_CACHE_NAME = 'wordsview-images-v1';

const CRITICAL_ASSETS = [
  '/assets/fonts/ChosunCentennial_ttf.ttf',
  '/assets/fonts/SeoulHangangL.ttf',
  '/assets/fonts/SeoulHangangM.ttf',
  '/assets/fonts/SeoulHangangB.ttf',
  '/assets/fonts/SeoulHangangEB.ttf',
  '/assets/img/bg.jpg',
  '/assets/img/grunge.png',
  '/assets/css/custom.css',
  '/assets/css/style.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(FONT_CACHE_NAME).then(cache => {
        return cache.addAll(CRITICAL_ASSETS.filter(asset => asset.includes('/fonts/')));
      }),
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return cache.addAll(CRITICAL_ASSETS.filter(asset => asset.includes('/img/')));
      }),
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(CRITICAL_ASSETS.filter(asset => asset.includes('/css/')));
      })
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![CACHE_NAME, FONT_CACHE_NAME, IMAGE_CACHE_NAME].includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.includes('/fonts/')) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            if (fetchResponse.ok) {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
  } else if (url.pathname.includes('/img/')) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            if (fetchResponse.ok) {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
  } else if (url.pathname.includes('/css/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request);
        });
      })
    );
  }
});