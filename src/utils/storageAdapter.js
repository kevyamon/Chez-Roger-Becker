/**
 * Adaptateur de stockage persistant sécurisé et résilient pour la PWA.
 * Isole les opérations de stockage dans des blocs try/catch sécurisés
 * pour supporter la navigation privée stricte et les quotas navigateur.
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'rb_access_token',
  REFRESH_TOKEN: 'rb_refresh_token',
  USER: 'rb_user',
  TOKEN_ACQUIRED_AT: 'rb_token_acquired_at',
  LAST_TRACKING_TOKEN: 'rb_last_tracking_token',
  ACTIVE_TAB: 'rb_active_tab',
  ORDERS_HISTORY: 'rb_orders_history',
  THEME: 'rb_theme'
};

class StorageAdapter {
  getAccessToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
    } catch {
      return null;
    }
  }

  getRefreshToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
    } catch {
      return null;
    }
  }

  getUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getTokenAcquiredAt() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TOKEN_ACQUIRED_AT);
      return raw ? parseInt(raw, 10) : null;
    } catch {
      return null;
    }
  }

  setSession({ accessToken, refreshToken, user }) {
    try {
      if (accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.TOKEN_ACQUIRED_AT, Date.now().toString());
      }
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    } catch (err) {
      console.warn('[StorageAdapter] Erreur lors de l\'enregistrement de session :', err);
    }
  }

  setAccessToken(accessToken) {
    try {
      if (accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.TOKEN_ACQUIRED_AT, Date.now().toString());
      }
    } catch (err) {
      console.warn('[StorageAdapter] Erreur lors de la mise à jour du token :', err);
    }
  }

  setUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    } catch (err) {
      console.warn('[StorageAdapter] Erreur lors de la mise à jour utilisateur :', err);
    }
  }

  clearAuthSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_ACQUIRED_AT);
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_TAB);
    } catch (err) {
      console.warn('[StorageAdapter] Erreur lors du nettoyage de session :', err);
    }
  }

  getTrackingToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_TRACKING_TOKEN) || null;
    } catch {
      return null;
    }
  }

  setTrackingToken(token) {
    try {
      if (token) {
        localStorage.setItem(STORAGE_KEYS.LAST_TRACKING_TOKEN, token);
      }
    } catch (err) {
      console.warn('[StorageAdapter] Erreur sauvegarde token de suivi :', err);
    }
  }
}

export const storageAdapter = new StorageAdapter();
export { STORAGE_KEYS };
