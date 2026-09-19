/**
 * Client HTTP centralisé (Axios) pour Chez Roger Becker.
 * Implémente la résilience Yély : Verrou Mutex anti-deadlock, rafraîchissement hybride et immunité hors-ligne.
 */

import axios from 'axios';
import { Mutex } from 'async-mutex';
import { storageAdapter } from '../utils/storageAdapter';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://chez-roger-becker-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const refreshMutex = new Mutex();

// Intercepteur de requête : injection synchrone du jeton d'accès
apiClient.interceptors.request.use(
  (config) => {
    const token = storageAdapter.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : gestion sécurisée des 401 avec Mutex
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Détection d'erreur réseau / hors-ligne : ne jamais déconnecter
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      (typeof navigator !== 'undefined' && !navigator.onLine);

    if (isNetworkError) {
      const customNetworkError = {
        message: 'Impossible de joindre le serveur. Veuillez vérifier votre connexion Internet.',
        code: 'NETWORK_ERROR',
        details: {},
        status: 0,
        isNetworkError: true
      };
      return Promise.reject(customNetworkError);
    }

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register-admin') ||
      originalRequest?.url?.includes('/auth/refresh');

    // Si erreur 401 sur une ressource protégée et requête non encore rejouée
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      // Acquisition du verrou Mutex pour sérialiser le rafraîchissement
      const release = await refreshMutex.acquire();

      try {
        const currentToken = storageAdapter.getAccessToken();
        const requestToken = originalRequest.headers?.Authorization?.replace('Bearer ', '');

        // Si le token a déjà été rafraîchi par une autre requête concurrente
        if (currentToken && currentToken !== requestToken) {
          originalRequest.headers.Authorization = `Bearer ${currentToken}`;
          return apiClient(originalRequest);
        }

        const refreshToken = storageAdapter.getRefreshToken();

        // Appel hybride : Cookie httpOnly + corps JSON de secours
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        if (refreshResponse.data?.success && refreshResponse.data?.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken, user } = refreshResponse.data.data;

          storageAdapter.setSession({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user
          });

          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        const isDefinitiveAuthError =
          refreshError.response?.status === 401 ||
          refreshError.response?.status === 403;

        // Invalidation uniquement si rejet définitif côté serveur
        if (isDefinitiveAuthError) {
          storageAdapter.clearAuthSession();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:expired'));
          }
        }
        return Promise.reject(refreshError);
      } finally {
        release();
      }
    }

    const customError = {
      message: error.response?.data?.error?.message || error.message || 'Une erreur inattendue est survenue.',
      code: error.response?.data?.error?.code || 'API_ERROR',
      details: error.response?.data?.error?.details || {},
      status: error.response?.status || 500,
      isNetworkError: false
    };

    return Promise.reject(customError);
  }
);
