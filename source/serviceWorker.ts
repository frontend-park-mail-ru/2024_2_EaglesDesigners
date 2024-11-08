const CACHE = "cache-v2";

self.addEventListener("install", (event) => {
  console.log("Installing service worker", event);

  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      cache.addAll(["/public/assets/image"]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((response) => {
          if (event.request.method !== "GET") {
            return response;
          }

          caches.open(CACHE).then((cache) => {
            try {
              cache.put(event.request, response.clone());
            } catch (e) {
              return new Response(JSON.stringify({ status: 408 }));
            }
          });
          return response;
        });
      }
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (CACHE !== cacheName) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
