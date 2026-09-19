/**
 * Contexte d'authentification pour les espaces Administrateur et Livreur.
 * Maintient la persistance synchrone du profil pour éviter les déconnexions intempestives lors des actualisations.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('rb_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('rb_access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rb_access_token');
      if (storedToken) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('rb_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    const res = await apiClient.post('/auth/login', { identifier, password });
    if (res.success && res.data) {
      const { user: userData, accessToken } = res.data;
      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('rb_access_token', accessToken);
      localStorage.setItem('rb_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Échec de connexion');
  };

  const registerAdmin = async ({ name, email, phone, password, privateKey }) => {
    const res = await apiClient.post('/auth/register-admin', {
      name,
      email,
      phone,
      password,
      privateKey
    });
    if (res.success && res.data) {
      const { user: userData, accessToken } = res.data;
      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('rb_access_token', accessToken);
      localStorage.setItem('rb_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Échec de l\'inscription administrateur.');
  };

  const logout = async () => {
    try {
      if (token) {
        await apiClient.post('/auth/logout');
      }
    } catch {
      // Ignorer les erreurs réseau lors du logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('rb_access_token');
      localStorage.removeItem('rb_user');
      sessionStorage.removeItem('rb_active_tab');
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
        logout
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
