// athar-frontend/public/sw.js
const CACHE_NAME = 'athar-v1';
const ASSETS_TO_CACHE = ['/'];

// عند تثبيت الـ SW، قم بتخزين الأصول
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// عند الطلب، حاول جلب من الكاش أولاً
self.addEventListener('fetch', (event) => {
  // نتجاهل طلبات التنقل (Navigation) لتبسيط الكود في البداية
  if (event.request.mode !== 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});