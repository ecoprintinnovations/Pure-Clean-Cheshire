// Service Worker for Pure Clean Cheshire
// Provides offline caching for static assets

const CACHE_NAME = 'pure-clean-cheshire-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/services.html',
  '/pricing.html',
  '/about.html',
  '/areas.html',
  '/contact.html',
  '/css/main.min.css',
  '/js/main.min.js',
  '/images/favicon.svg',
  '/manifest.json'
];

const CACHE_STRATEGIES = {
  // Cache first for static assets
  cacheFirst: [
    '/css/',
    '/js/',
    '/images/',
    '/fonts/'
  ],
  // Network first for HTML pages
  networkFirst: [
    '/index.html',
    '/services.html',
    '/pricing.html',
    '/about.html',
    '/areas.html',
    '/contact.html'
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (Google Fonts, analytics, etc.)
  if (url.origin !== location.origin) return;

  // Determine strategy based on request type
  const isStaticAsset = CACHE_STRATEGIES.cacheFirst.some(path => url.pathname.startsWith(path));
  const isHtmlPage = CACHE_STRATEGIES.networkFirst.some(path => url.pathname === path || url.pathname === '/' && path === '/index.html');

  if (isStaticAsset) {
    // Cache first strategy for static assets
    event.respondWith(cacheFirst(request));
  } else if (isHtmlPage || url.pathname.endsWith('.html')) {
    // Network first strategy for HTML pages
    event.respondWith(networkFirst(request));
  } else {
    // Default: network first
    event.respondWith(networkFirst(request));
  }
});

// Cache first strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    throw error;
  }
}

// Network first strategy
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    throw error;
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'getCacheSize') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(keys => {
        event.ports[0].postMessage({ cacheSize: keys.length });
      });
    });
  }
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'form-submit') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Handle offline form submissions when back online
  // Implementation would store form data in IndexedDB and sync when online
  console.log('[SW] Background sync triggered for form submissions');
}

console.log('[SW] Service Worker loaded');