/**
 * Client de communication temps réel (Socket.IO) pour Chez Roger Becker.
 * Optimisé pour la résilience réseau et le cycle de vie mobile (iOS WebKit / Safari / PWA).
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://chez-roger-becker-backend.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
});

// Registre des souscriptions actives pour réabonnement automatique lors des reconnexions
const activeSubscriptions = new Set();

const resubscribeAllRooms = () => {
  if (!socket.connected) return;
  activeSubscriptions.forEach((subKey) => {
    if (subKey === 'admin') {
      socket.emit('join:admin');
    } else if (subKey === 'drivers') {
      socket.emit('join:drivers');
    } else if (subKey.startsWith('order:')) {
      const token = subKey.replace('order:', '');
      socket.emit('join:order', token);
    } else if (subKey.startsWith('driver:')) {
      const driverId = subKey.replace('driver:', '');
      socket.emit('join:driver', driverId);
    }
  });
};

socket.on('connect', () => {
  resubscribeAllRooms();
});

// Gestionnaire de cycle de vie mobile : réveille la connexion dès que l'écran s'allume ou que l'onglet revient
if (typeof window !== 'undefined') {
  const syncSocketOnForeground = () => {
    if (document.visibilityState === 'visible') {
      if (!socket.connected) {
        socket.connect();
      } else {
        resubscribeAllRooms();
      }
    }
  };

  document.addEventListener('visibilitychange', syncSocketOnForeground);
  window.addEventListener('pageshow', syncSocketOnForeground);
  window.addEventListener('online', syncSocketOnForeground);
}

/**
 * Rejoint le salon d'administration
 */
export const joinAdminRoom = () => {
  activeSubscriptions.add('admin');
  if (socket.connected) {
    socket.emit('join:admin');
  }
};

/**
 * Quitte le salon d'administration
 */
export const leaveAdminRoom = () => {
  activeSubscriptions.delete('admin');
};

/**
 * Rejoint le salon général des livreurs
 */
export const joinDriversRoom = () => {
  activeSubscriptions.add('drivers');
  if (socket.connected) {
    socket.emit('join:drivers');
  }
};

/**
 * Quitte le salon général des livreurs
 */
export const leaveDriversRoom = () => {
  activeSubscriptions.delete('drivers');
};

/**
 * Rejoint le salon d'un suivi de commande particulier
 * @param {string} trackingToken - Token unique de la commande
 */
export const joinOrderRoom = (trackingToken) => {
  if (!trackingToken) return;
  const key = `order:${trackingToken}`;
  activeSubscriptions.add(key);
  if (socket.connected) {
    socket.emit('join:order', trackingToken);
  }
};

/**
 * Quitte le salon d'un suivi de commande
 * @param {string} trackingToken - Token unique de la commande
 */
export const leaveOrderRoom = (trackingToken) => {
  if (!trackingToken) return;
  activeSubscriptions.delete(`order:${trackingToken}`);
};

/**
 * Rejoint le salon dédié d'un livreur pour assignations ciblées
 * @param {string} driverId - Identifiant MongoDB du livreur
 */
export const joinDriverPersonalRoom = (driverId) => {
  if (!driverId) return;
  const key = `driver:${driverId}`;
  activeSubscriptions.add(key);
  if (socket.connected) {
    socket.emit('join:driver', driverId);
  }
};

/**
 * Quitte le salon dédié d'un livreur
 * @param {string} driverId - Identifiant MongoDB du livreur
 */
export const leaveDriverPersonalRoom = (driverId) => {
  if (!driverId) return;
  activeSubscriptions.delete(`driver:${driverId}`);
};


