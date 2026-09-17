/**
 * Composant Modal interactif et accessible.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '480px' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={{ ...modalContainerStyle, maxWidth }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in"
      >
        <div style={headerStyle}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{title}</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={20} />
          </button>
        </div>
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(6px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '0'
};

const modalContainerStyle = {
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  width: '100%',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.25)',
  border: '1px solid var(--border-color)',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '18px 20px',
  borderBottom: '1px solid var(--border-color)'
};

const closeButtonStyle = {
  color: 'var(--text-muted)',
  padding: '6px',
  borderRadius: '50%'
};

const contentStyle = {
  padding: '20px',
  overflowY: 'auto'
};
