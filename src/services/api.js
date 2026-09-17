/**
 * Client HTTP centralise (Axios) pour Chez Roger Becker.
 * Gestion transparente des en-tetes d'authentification et intercepteur d'erreurs.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://chez-roger-becker-backend.onrender.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable de contrôle pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur de requetes pour injecter le token Bearer
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rb_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de reponses avec rafraichissement silencieux
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et requete non encore rejouee
    if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes('/auth/login') && !originalRequest?.url?.includes('/auth/register-admin') && !originalRequest?.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
          const newToken = refreshRes.data.data.accessToken;
          localStorage.setItem('rb_access_token', newToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('rb_access_token');
      } finally {
        isRefreshing = false;
      }
    }

    const customError = {
      message: error.response?.data?.error?.message || error.message || 'Une erreur réseau est survenue',
      code: error.response?.data?.error?.code || 'NETWORK_ERROR',
      details: error.response?.data?.error?.details || {},
      status: error.response?.status || 500
    };
    return Promise.reject(customError);
  }
);
