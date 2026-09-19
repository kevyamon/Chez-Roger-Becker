/**
 * Hook de cycle de vie et résilience PWA (Standard Yély).
 * Orchestre la détection de connectivité, le réveil d'onglet (Foreground) et le rafraîchissement transparent.
 */

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageAdapter } from '../utils/storageAdapter';

// Intervalle minimum de 5 minutes entre deux rafraîchissements automatiques par visibilité
const MIN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const useAppStartup = () => {
  const { isAuthenticated, forceSilentRefresh } = useAuth();
  const lastCheckRef = useRef(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Écouteur de retour de connexion Internet
    const handleOnline = () => {
      forceSilentRefresh();
    };

    // 2. Écouteur de retour au premier plan (Foreground / Changement d'onglet)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const acquiredAt = storageAdapter.getTokenAcquiredAt() || 0;
        const timeSinceAcquired = now - acquiredAt;
        const timeSinceLastCheck = now - lastCheckRef.current;

        // Rafraîchit si le jeton a plus de 5 minutes et qu'on n'a pas vérifié récemment
        if (timeSinceAcquired > MIN_REFRESH_INTERVAL_MS && timeSinceLastCheck > MIN_REFRESH_INTERVAL_MS) {
          lastCheckRef.current = now;
          forceSilentRefresh();
        }
      }
    };

    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, forceSilentRefresh]);
};
