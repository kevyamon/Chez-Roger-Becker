/**
 * Service Worker Firebase Cloud Messaging (FCM) pour Chez Roger Becker.
 * Prend en charge la réception et l'affichage des notifications push en arrière-plan (PWA).
 */

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialisation de Firebase dans le contexte du Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyABs2vuWdHazOF5IpjixsbJ99Fb5JKjLE8",
  authDomain: "chez-roger-becker.firebaseapp.com",
  projectId: "chez-roger-becker",
  storageBucket: "chez-roger-becker.firebasestorage.app",
  messagingSenderId: "1076304283366",
  appId: "1:1076304283366:web:6fa4f9b42e42e095201d27"
});

const messaging = firebase.messaging();

// Traitement des messages reçus lorsque l'application est en arrière-plan ou fermée
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'Chez Roger Becker';
  const body = payload.notification?.body || payload.data?.body || 'Mise à jour concernant votre commande.';
  const icon = payload.notification?.icon || '/pwa-192x192.png';
  const targetUrl = payload.data?.url || payload.fcmOptions?.link || '/';

  const notificationOptions = {
    body,
    icon,
    badge: '/pwa-192x192.png',
    data: {
      url: targetUrl,
      ...payload.data
    },
    vibrate: [200, 100, 200],
    requireInteraction: true
  };

  return self.registration.showNotification(title, notificationOptions);
});

// Gestion du clic sur la notification reçue
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si un onglet de l'application est déjà ouvert, lui donner le focus
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && urlToOpen !== '/') {
            client.navigate(urlToOpen);
          }
          return client.focus();
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre vers la page cible
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
