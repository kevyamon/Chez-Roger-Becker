/**
 * Composant de chargement animé haut de gamme (LoadingSpinner).
 * Fournit un indicateur visuel fluide et professionnel pour les sessions et requêtes.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({
  message = 'Chargement en cours...',
  subMessage = 'Veuillez patienter un instant...',
  fullScreen = false,
  size = 'lg'
}) => {
  const spinnerDimensions = {
    sm: { diameter: 24, iconSize: 14, textGap: 6 },
    md: { diameter: 40, iconSize: 20, textGap: 10 },
    lg: { diameter: 56, iconSize: 26, textGap: 14 }
  }[size] || { diameter: 56, iconSize: 26, textGap: 14 };

  const containerDynamicStyle = fullScreen
    ? fullScreenContainerStyle
    : defaultContainerStyle;

  return (
    <div style={containerDynamicStyle} className="animate-fade-in" role="status" aria-live="polite">
      <div
        style={{
          position: 'relative',
          width: `${spinnerDimensions.diameter}px`,
          height: `${spinnerDimensions.diameter}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Anneau rotatif principal à gradient sémantique */}
        <div
          className="animate-spin"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3.5px solid var(--border-color)',
            borderTopColor: 'var(--color-primary)',
            borderRightColor: 'var(--color-secondary)',
            boxSizing: 'border-box'
          }}
        />

        {/* Cœur intérieur avec icône vectorielle */}
        <div style={innerPulseStyle}>
          <Loader2
            size={spinnerDimensions.iconSize}
            color="var(--color-primary)"
            className="animate-spin"
            style={{ animationDuration: '2s' }}
          />
        </div>
      </div>

      {message && (
        <div style={{ ...textWrapStyle, gap: `${spinnerDimensions.textGap / 2}px` }}>
          <strong style={messageStyle}>{message}</strong>
          {subMessage && <span style={subMessageStyle}>{subMessage}</span>}
        </div>
      )}
    </div>
  );
};

const defaultContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 16px',
  minHeight: '280px',
  gap: '16px',
  textAlign: 'center',
  width: '100%'
};

const fullScreenContainerStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  backgroundColor: 'var(--bg-primary)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  gap: '18px',
  textAlign: 'center'
};

const innerPulseStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '70%',
  height: '70%',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary-surface)'
};

const textWrapStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '320px'
};

const messageStyle = {
  fontSize: '0.96rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  letterSpacing: '-0.01em'
};

const subMessageStyle = {
  fontSize: '0.80rem',
  color: 'var(--text-secondary)',
  marginTop: '2px'
};
