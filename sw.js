// ══════════════════════════════════════════════════════
//  SYNERGY ENGINE — Service Worker v1.0
//  Enables offline use, caching, and PWA install
// ══════════════════════════════════════════════════════

const CACHE_NAME = 'synergy-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap'
];

// ── INSTALL: cache all static assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching static assets');
      // Cache core files — fonts may fail (CORS), that's OK
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => null))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clear old caches ──
self.addEventListener('activate', event => {
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
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: network-first for HTML, cache-first for assets ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // HTML pages: network-first, fallback to cache
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Fonts: cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// ── PUSH NOTIFICATIONS (for alarms) ──
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: '⏰ Synergy', body: 'Wake up!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag: 'synergy-alarm',
      renotify: true,
      requireInteraction: true,
      actions: [
        { action: 'stop', title: 'Stop Alarm' },
        { action: 'snooze', title: 'Snooze 5min' }
      ]
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'snooze') {
    // Re-show after 5 minutes
    setTimeout(() => {
      self.registration.showNotification('⏰ Synergy — Snooze Over!', {
        body: 'Time to wake up!',
        icon: '/icon-192.svg',
        tag: 'synergy-alarm-snooze',
        requireInteraction: true
      });
    }, 5 * 60 * 1000);
  } else {
    // Open app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus();
        }
        return clients.openWindow('/?tab=sleep');
      })
    );
  }
});
