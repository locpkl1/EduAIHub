// Cache only the public notice, never app HTML, API responses or user data.
const CACHE_NAME = 'eduaihub-offline-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const response = await fetch(OFFLINE_URL, { cache: 'reload' });
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')
      || !(await response.clone().text()).includes('eduaihub-offline-notice')) {
      throw new Error('Offline notice unavailable; retain the current worker.');
    }
    const cache = await caches.open(CACHE_NAME);
    await cache.put(OFFLINE_URL, response);
    await self.skipWaiting();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || request.mode !== 'navigate'
    || url.origin !== self.location.origin || request.headers.has('Authorization')
    || /^\/(api|auth|\.well-known)(\/|$)/.test(url.pathname)
    || ['code', 'access_token', 'refresh_token', 'error'].some((key) => url.searchParams.has(key))) return;
  event.respondWith((async () => {
    try {
      // Every navigation checks the server; no stale HTML from either cache layer.
      return await fetch(request, { cache: 'no-store' });
    } catch {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(OFFLINE_URL)) || Response.error();
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Remove known app-owned caches only, including the legacy HTML cache.
    await Promise.all(keys.filter((key) => key === 'eduai-hub-v2'
      || (key.startsWith('eduaihub-offline-') && key !== CACHE_NAME))
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
