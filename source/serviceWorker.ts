const CACHE = "cache-v2";

self.addEventListener('install', (event) => {
    console.log('Installing service worker', event);

    event.waitUntil(
        caches.open(CACHE)
            .then((cache) =>{
                cache.addAll([
                    '/',
                    '/public/assets/image',
                ]);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            } else {
              return fetch(event.request)
                .then(res => {
                  return caches.open('dynamic')
                    .then(cache => {
                      cache.put(event.request.url, res.clone());
                      return res;
                    });
                });
            }
        })
    );

});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (CACHE !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
