/**
 * Contexte global de gestion des notifications push (PushNotificationContext).
 * Fournit l'état d'abonnement et écoute les messages en premier plan avec cycle de vie sécurisé.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pushNotificationService } from '../services/pushNotification.service';
import { useToast } from './ToastContext';

const PushNotificationContext = createContext(null);

export const PushNotificationProvider = ({ children }) => {
  const [permissionStatus, setPermissionStatus] = useState(
    pushNotificationService.getPermissionStatus()
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const { showInfo, showSuccess } = useToast();

  // Initialisation et gestion robuste de l'écouteur en premier plan
  useEffect(() => {
    let isMounted = true;
    let unsubscribeForeground = null;

    const status = pushNotificationService.getPermissionStatus();
    setPermissionStatus(status);

    if (status === 'granted') {
      pushNotificationService
        .requestPermissionAndGetToken()
        .then((res) => {
          if (isMounted && res?.success) {
            setIsSubscribed(true);
            setFcmToken(res.token);
          }
        })
        .catch(() => {});
    }

    // Enregistrement de l'écouteur de premier plan avec désabonnement sécurisé
    pushNotificationService
      .onForegroundMessage((payload) => {
        if (!isMounted) return;
        const title = payload.notification?.title || payload.data?.title || 'Chez Roger Becker';
        const body = payload.notification?.body || payload.data?.body || '';
        showInfo(`${title} : ${body}`);
      })
      .then((unsub) => {
        if (!isMounted && typeof unsub === 'function') {
          unsub();
        } else if (typeof unsub === 'function') {
          unsubscribeForeground = unsub;
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      if (typeof unsubscribeForeground === 'function') {
        unsubscribeForeground();
      }
    };
  }, [showInfo]);

  /**
   * Déclenche la demande de permission utilisateur.
   */
  const requestPushPermission = useCallback(
    async ({ role = 'CUSTOMER', trackingToken = null } = {}) => {
      const result = await pushNotificationService.requestPermissionAndGetToken({
        role,
        trackingToken
      });

      setPermissionStatus(pushNotificationService.getPermissionStatus());

      if (result.success) {
        setIsSubscribed(true);
        setFcmToken(result.token);
        showSuccess('Notifications push activées avec succès.');
        return true;
      }
      return false;
    },
    [showSuccess]
  );

  /**
   * Associe une commande spécifique au jeton de cet appareil.
   */
  const linkOrderToPush = useCallback(async (trackingToken) => {
    await pushNotificationService.linkOrderToPush(trackingToken);
  }, []);

  return (
    <PushNotificationContext.Provider
      value={{
        permissionStatus,
        isSubscribed,
        fcmToken,
        requestPushPermission,
        linkOrderToPush,
        isSupported: pushNotificationService.isPushSupported()
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotification = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotification doit être utilisé au sein de PushNotificationProvider');
  }
  return context;
};
