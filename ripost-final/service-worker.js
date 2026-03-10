/**
 * Ripost AI – Service Worker v2
 * Strategy: Cache-first for assets, Network-first for HTML, Stale-while-revalidate for API
 */

const CACHE_NAME = 'ripost-v2.0.0';
const OFFLINE_PAGE = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/demo.html',
  '/blog.html',
  '/app.html',
  '/manifest.json',
];

// ── INSTALL ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache failed for some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating v2...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and external requests
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis') && !url.hostname.includes('fonts.gstatic')) return;

  // API routes: network-first with timeout fallback
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/functions/')) {
    event.respondWith(networkFirstWithTimeout(request, 5000));
    return;
  }

  // HTML pages: network-first (always fresh)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstHTML(request));
    return;
  }

  // Fonts: cache-first (long-lived)
  if (url.hostname.includes('fonts.gstatic') || url.hostname.includes('fonts.googleapis')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ── STRATEGIES ────────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

async function networkFirstHTML(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Return offline page if available
    const offline = await caches.match(OFFLINE_PAGE);
    return offline || new Response('<h1>Brak połączenia</h1><p>Ripost AI wymaga połączenia internetowego.</p>', {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
    });
  }
}

async function networkFirstWithTimeout(request, timeout) {
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout));
  try {
    const response = await Promise.race([fetch(request), timeoutPromise]);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: 'Offline – API unavailable' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503,
    });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response && response.ok) {
      caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  return cached || await fetchPromise || new Response('Not available', { status: 503 });
}

// ── BACKGROUND SYNC (for future use) ──────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-leads') {
    event.waitUntil(syncPendingLeads());
  }
});

async function syncPendingLeads() {
  // In production: sync offline-collected leads to your backend
  console.log('[SW] Syncing pending leads...');
}

// ── PUSH NOTIFICATIONS (placeholder) ─────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'Ripost AI', body: 'Nowa wiadomość!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
    })
  );
});
