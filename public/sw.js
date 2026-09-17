// Minimal service worker: enables "Add to Home Screen" / installable app
// behavior. Intentionally does NOT cache API responses or pages, so the
// farmer/staff portals always show live queue data — it only exists to
// satisfy the browser's installability requirement.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', () => {
  // No-op: always go to the network. This keeps queue/wait-time data live.
});
