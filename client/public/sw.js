const CACHE_NAME = 'techstore-v2';

const PRE_CACHE_URLS = [
  '/',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.svg',
];

// Install: предварительное кэширование статических ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching resources');
      return cache.addAll(PRE_CACHE_URLS);
    }),
  );
  self.skipWaiting();
});

// Activate: удаление старых версий кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }),
      ),
    ),
  );
  self.clients.claim();
});

// Fetch: стратегии кэширования
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') return;

  // Пропускаем chrome-extension и т.п.
  if (!url.protocol.startsWith('http')) return;

  // API-запросы: Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Статические ресурсы: Cache First
  event.respondWith(cacheFirst(request));
});

// Network First: сначала сеть, при ошибке — кэш
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('{"error":"Нет подключения к сети"}', {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Push: показать уведомление
self.addEventListener('push', (event) => {
  let data = { title: 'TechStore', body: 'Новое уведомление', url: '/' };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url,
      reminderId: data.reminderId || null,
      apiBase: data.apiBase || null,
    },
  };

  if (data.reminderId) {
    options.actions = [
      { action: 'snooze_5m', title: 'Отложить на 5 мин' },
    ];
  }

  const broadcastPayload = { type: 'PUSH_RECEIVED', title: data.title, body: data.body };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      new Promise((resolve) => {
        try {
          const bc = new BroadcastChannel('techstore_push');
          bc.postMessage(broadcastPayload);
          bc.close();
        } catch (e) {
          console.warn('[SW] BroadcastChannel failed:', e);
        }
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
          clients.forEach((c) => c.postMessage(broadcastPayload));
          resolve();
        });
      }),
    ]),
  );
});

// Notification click: открыть приложение или отложить (snooze)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { url, reminderId, apiBase } = event.notification.data || {};

  if (event.action === 'snooze_5m' && reminderId && apiBase) {
    event.waitUntil(
      fetch(`${apiBase}/api/reminders/snooze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderId }),
      }).catch((err) => console.error('[SW] Snooze request failed:', err)),
    );
    return;
  }

  const targetUrl = url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});

// Cache First: сначала кэш, при промахе — сеть
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
    // Для навигационных запросов показываем offline-страницу
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }
    return new Response('Нет подключения к сети', { status: 503 });
  }
}
