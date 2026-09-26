/**
 * Contexte de gestion du theme (Mode Clair / Mode Nuit).
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme } from '../styles/theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('rb_theme_dark');
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return false;
      }
    }
    // Mode Jour (Clair) par défaut pour tous les nouveaux visiteurs
    return false;
  });

  useEffect(() => {
    applyTheme(isDarkMode);
    localStorage.setItem('rb_theme_dark', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit etre utilise au sein de ThemeProvider');
  }
  return context;
};
