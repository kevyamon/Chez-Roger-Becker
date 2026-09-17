/**
 * Client de communication temps reel (Socket.IO) pour Chez Roger Becker.
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://chez-roger-becker-backend.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ['websocket', 'polling']
});

/**
 * Rejoint le salon d'un suivi de commande particulier
 * @param {string} trackingToken - Token unique de la commande
 */
export const joinOrderRoom = (trackingToken) => {
  if (trackingToken) {
    socket.emit('join:order', trackingToken);
  }
};

/**
 * Rejoint le salon d'administration
 */
export const joinAdminRoom = () => {
  socket.emit('join:admin');
};

/**
 * Rejoint le salon des livreurs
 */
export const joinDriversRoom = () => {
  socket.emit('join:drivers');
};
