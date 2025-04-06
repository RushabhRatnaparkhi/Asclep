// Version number for cache busting
const VERSION = 'v1';

// Log any errors that occur during service worker setup
self.addEventListener('error', (event) => {
  console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.resolve()
      .then(() => {
        console.log('[ServiceWorker] Installing...');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.resolve()
      .then(() => {
        console.log('[ServiceWorker] Activating...');
        return clients.claim();
      })
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || 'Medication Reminder', {
        body: data.body || 'Time to take your medication',
        icon: '/icon.png',
        badge: '/icon.png',
        tag: 'medication-reminder',
        requireInteraction: true,
        vibrate: [100, 50, 100],
        data: {
          url: '/medications'
        } 
      })
    );
  } catch (error) {
    console.error('[ServiceWorker] Push event failed:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});