/**
 * Contexte d'authentification pour les espaces Administrateur et Livreur.
 * Implémente la restauration optimiste synchrone et la résilience offline selon Yély.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import { storageAdapter } from '../utils/storageAdapter';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Pilier 1 : Restauration optimiste et synchrone immédiate au lancement
  const [user, setUser] = useState(() => storageAdapter.getUser());
  const [token, setToken] = useState(() => storageAdapter.getAccessToken());
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    try {
      if (storageAdapter.getAccessToken()) {
        await apiClient.post('/auth/logout');
      }
    } catch {
      // Ignorer les erreurs réseau lors de la déconnexion
    } finally {
      storageAdapter.clearAuthSession();
      setUser(null);
      setToken(null);
    }
  }, []);

  // Rafraîchissement silencieux de session en tâche de fond
  const forceSilentRefresh = useCallback(async () => {
    const currentRefreshToken = storageAdapter.getRefreshToken();
    if (!currentRefreshToken && !token) return null;

    try {
      const res = await apiClient.post('/auth/refresh', {
        refreshToken: currentRefreshToken
      });

      if (res.success && res.data) {
        const { user: updatedUser, accessToken, refreshToken: newRefreshToken } = res.data;
        setUser(updatedUser);
        setToken(accessToken);
        storageAdapter.setSession({
          accessToken,
          refreshToken: newRefreshToken,
          user: updatedUser
        });
        return updatedUser;
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout();
      }
      // Si erreur réseau, on ne déconnecte JAMAIS l'utilisateur
    }
    return null;
  }, [token, logout]);

  // Synchronisation d'arrière-plan au démarrage (non bloquante)
  useEffect(() => {
    const syncSession = async () => {
      const storedToken = storageAdapter.getAccessToken();
      if (!storedToken) return;

      try {
        const res = await apiClient.get('/auth/me');
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          storageAdapter.setUser(res.data.user);
        }
      } catch (err) {
        // Déconnexion uniquement si rejet définitif d'autorisation
        if (err.status === 401 && !err.isNetworkError) {
          logout();
        }
      }
    };

    syncSession();
  }, [logout]);

  // Écoute des événements de révocation de session globale
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  const login = async (identifier, password) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { identifier, password });
      if (res.success && res.data) {
        const { user: userData, accessToken, refreshToken } = res.data;
        setUser(userData);
        setToken(accessToken);
        storageAdapter.setSession({ accessToken, refreshToken, user: userData });
        return userData;
      }
      throw new Error(res.message || 'Identifiants invalides.');
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (formData) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register-admin', formData);
      if (res.success && res.data) {
        const { user: userData, accessToken, refreshToken } = res.data;
        setUser(userData);
        setToken(accessToken);
        storageAdapter.setSession({ accessToken, refreshToken, user: userData });
        return userData;
      }
      throw new Error(res.message || 'Échec de l\'inscription administrateur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'ADMIN',
        isDriver: user?.role === 'DRIVER',
        isLoading,
        login,
        registerAdmin,
        logout,
        forceSilentRefresh
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein de AuthProvider');
  }
  return context;
};
