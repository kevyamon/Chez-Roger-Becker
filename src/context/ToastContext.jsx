/**
 * Contexte de notifications personnalisees (Toast) en remplacement strict de la fonction alert() native.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showSuccess = (message) => addToast({ message, type: 'success' });
  const showError = (message) => addToast({ message, type: 'error' });
  const showWarning = (message) => addToast({ message, type: 'warning' });
  const showInfo = (message) => addToast({ message, type: 'info' });

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div style={toastContainerStyle}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...toastItemStyle, ...getToastTypeStyle(toast.type) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              {getToastIcon(toast.type)}
              <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} style={{ color: 'inherit', padding: '4px' }}>
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
    throw new Error('useToast doit etre utilise au sein de ToastProvider');
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
  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  animation: 'fadeIn 0.25s ease'
};

const getToastTypeStyle = (type) => {
  switch (type) {
    case 'success':
      return { backgroundColor: '#15803D', color: '#FFFFFF' };
    case 'error':
      return { backgroundColor: '#B91C1C', color: '#FFFFFF' };
    case 'warning':
      return { backgroundColor: '#D97706', color: '#FFFFFF' };
    default:
      return { backgroundColor: '#0369A1', color: '#FFFFFF' };
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
