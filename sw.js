/* Magnus Website Service Worker (basic offline + SWR caching)
 * Cache strategy:
 *  - Precache core shell (HTML, CSS/JS, icons)
 *  - Runtime: Stale-While-Revalidate for same-origin GET requests
 *  - Offline fallback to /offline.html for navigations
 */
const VERSION = 'v1.0.0';
const PRECACHE = `magnus-precache-${VERSION}`;
const RUNTIME = `magnus-runtime-${VERSION}`;

// Add/adjust the core files for your site:
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/magnus_registration.html',
  '/magnus_blogs.html',
  '/favicon.ico',
  '/favicon-16.png',
  '/favicon-32.png',
  '/favicon-48.png',
  '/favicon-192.png',
  '/favicon-512.png',
  '/apple-touch-icon.png',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (!key.includes(VERSION)) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Helper: network request for navigation documents
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    // If successful, optionally put a copy in cache
    const cache = await caches.open(RUNTIME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    // Offline fallback
    const cache = await caches.open(PRECACHE);
    return cache.match('/offline.html');
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only same-origin GETs
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  // HTML navigations → offline fallback aware
  if (request.mode === 'navigate' || (request.headers.get('Accept') || '').includes('text/html')) {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Stale-While-Revalidate for other requests (images, CSS, JS, etc.)
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(request);
    const networkFetch = fetch(request).then((response) => {
      // Only cache OK responses
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => cached);
    return cached || networkFetch;
  })());
});
