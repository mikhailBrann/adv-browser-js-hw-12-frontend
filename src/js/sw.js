import { precacheAndRoute } from 'workbox-precaching';

// Добавьте этот комментарий и следующую строку
// Inject manifest here
precacheAndRoute(self.__WB_MANIFEST);

const FETCH_URLS = [
    '/',
    '/index.html',
    '/main.css',
    '/main.js',
];

//устанавливаем кеш для новостей
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('news-cache')
        .then((cache) => {
          cache.addAll([
            './',
            './index.html',
            './main.css',
            './main.js'
          ])
        })
    )
});

self.addEventListener('message', (event) => {
    console.log(event.data);
});


self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (FETCH_URLS.includes(url.pathname)) {
      event.respondWith(fetchPriorityThenCache(event));
      return;
    }
});


async function fetchPriorityThenCache(event) {
    let response;
  
    try {
      response = await fetch(event.request);
    } catch (error) {
      const cacheResponse = await caches.match(event.request)
      
      if (cacheResponse) {
        return cacheResponse;
      }
  
      return new Response('Нет соединения');
    }
  
    const cache = await caches.open('news-cache');
  
    cache.put(event.request, response.clone());
  
    return response;
}
