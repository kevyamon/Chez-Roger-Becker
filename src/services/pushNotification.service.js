/**
 * Service de gestion des notifications push côté client (Web Push / FCM).
 */

import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging, VAPID_KEY } from '../config/firebase';
import { apiClient } from './api';

const PUSH_TOKEN_STORAGE_KEY = 'rb_fcm_push_token';

class PushNotificationService {
  /**
   * Vérifie si les notifications push sont supportées par l'environnement courant.
   */
  isPushSupported() {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    );
  }

  /**
   * Statut actuel de la permission navigateur ('default', 'granted', 'denied').
   */
  getPermissionStatus() {
    if (!this.isPushSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Demande la permission à l'utilisateur et génère le jeton FCM.
   */
  async requestPermissionAndGetToken({ role = 'CUSTOMER', trackingToken = null } = {}) {
    if (!this.isPushSupported()) {
      return { success: false, reason: 'NOT_SUPPORTED' };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, reason: 'DENIED', permission };
      }

      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        return { success: false, reason: 'MESSAGING_UNAVAILABLE' };
      }

      // Enregistrement ou récupération du Service Worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (currentToken) {
        localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, currentToken);
        await this.syncTokenWithBackend(currentToken, { role, trackingToken });
        return { success: true, token: currentToken };
      } else {
        return { success: false, reason: 'NO_TOKEN_GENERATED' };
      }
    } catch (error) {
      console.error('[PushNotificationService] Erreur d\'activation :', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Synchronise le jeton avec le backend.
   */
  async syncTokenWithBackend(token, { role = 'CUSTOMER', trackingToken = null } = {}) {
    try {
      const response = await apiClient.post('/notifications/subscribe', {
        token,
        role,
        trackingToken,
        userAgent: navigator.userAgent
      });
      return response;
    } catch (err) {
      console.warn('[PushNotificationService] Échec de synchronisation avec le serveur :', err.message);
    }
  }

  /**
   * Associe une commande spécifique au jeton existant de l'appareil.
   */
  async linkOrderToPush(trackingToken) {
    const savedToken = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
    if (!savedToken || !trackingToken) return;

    try {
      await apiClient.post('/notifications/link-order', {
        token: savedToken,
        trackingToken
      });
    } catch (err) {
      console.warn('[PushNotificationService] Échec d\'association de la commande :', err.message);
    }
  }

  /**
   * Écoute les notifications lorsque l'application est ouverte au premier plan.
   */
  async onForegroundMessage(callback) {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return () => {};

    return onMessage(messaging, (payload) => {
      if (typeof callback === 'function') {
        callback(payload);
      }
    });
  }
}

export const pushNotificationService = new PushNotificationService();
