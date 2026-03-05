// Banditos Family — Service Worker voor Push Notificaties
const CACHE_NAME = 'banditos-v1';

// Push notificatie ontvangen
self.addEventListener('push', event => {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'Banditos', body: event.data.text() }; }

  const options = {
    body: data.body || 'Nieuw bericht!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    image: data.image || undefined,
    vibrate: [200, 100, 200],
    tag: data.tag || 'banditos-msg',
    renotify: true,
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      { action: 'open', title: '💬 Openen' },
      { action: 'close', title: 'Sluiten' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🤠 Banditos Family', options)
  );
});

// Notificatie aangeklikt
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// Installatie
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
