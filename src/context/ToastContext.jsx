/**
 * Contexte de notifications personnalisées (Toast) en remplacement strict de la fonction alert() native.
 * Intègre un filtre anti-doublon intelligent et la mémoïsation complète des émetteurs.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const recentToastsRef = useRef(new Map());

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    if (!message) return;

    // Filtre anti-doublon : bloque le même message reçu sous 1500 ms
    const now = Date.now();
    const key = `${type}:${message.trim()}`;
    const lastTime = recentToastsRef.current.get(key);

    if (lastTime && now - lastTime < 1500) {
      return;
    }
    recentToastsRef.current.set(key, now);

    // Nettoyage régulier de l'historique anti-doublon
    if (recentToastsRef.current.size > 20) {
      recentToastsRef.current.clear();
    }

    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((message) => addToast({ message, type: 'success' }), [addToast]);
  const showError = useCallback((message) => addToast({ message, type: 'error' }), [addToast]);
  const showWarning = useCallback((message) => addToast({ message, type: 'warning' }), [addToast]);
  const showInfo = useCallback((message) => addToast({ message, type: 'info' }), [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div style={toastContainerStyle}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...toastItemStyle, ...getToastTypeStyle(toast.type) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              {getToastIcon(toast.type)}
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={closeBtnStyle}
              aria-label="Fermer la notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé au sein de ToastProvider');
  }
  return context;
};

const toastContainerStyle = {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '90%',
  maxWidth: '440px'
};

const toastItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderRadius: '14px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
  animation: 'fadeIn 0.25s ease'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#FFFFFF',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const getToastTypeStyle = (type) => {
  switch (type) {
    case 'success':
      return { backgroundColor: 'var(--status-success, #16A34A)', color: '#FFFFFF' };
    case 'error':
      return { backgroundColor: 'var(--status-error, #DC2626)', color: '#FFFFFF' };
    case 'warning':
      return { backgroundColor: 'var(--status-warning, #F59E0B)', color: '#FFFFFF' };
    default:
      return { backgroundColor: 'var(--status-info, #0284C7)', color: '#FFFFFF' };
  }
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={18} />;
    case 'error':
      return <XCircle size={18} />;
    case 'warning':
      return <AlertTriangle size={18} />;
    default:
      return <Info size={18} />;
  }
};
