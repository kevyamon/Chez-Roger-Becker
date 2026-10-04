/**
 * Bannière d'information élégante pour la mise en route du serveur (ServerWakingNotice).
 * Rassure l'utilisateur pendant la phase de réveil à froid de l'infrastructure cloud gratuite.
 */

import React from 'react';
import { Flame, Loader2 } from 'lucide-react';

export const ServerWakingNotice = ({ message, subMessage }) => {
  return (
    <div className="animate-fade-in" style={containerStyle} role="status" aria-live="polite">
      <div style={iconBadgeStyle}>
        <Flame size={16} color="var(--color-primary)" className="animate-pulse" />
      </div>
      <div style={textWrapperStyle}>
        <div style={titleRowStyle}>
          <span style={titleStyle}>
            {message || 'Connexion au restaurant en cours…'}
          </span>
          <Loader2 size={13} color="var(--color-primary)" className="animate-spin" />
        </div>
        <p style={subTextStyle}>
          {subMessage || 'Le serveur gratuit se réveille. Vos spécialités s’affichent dans un instant.'}
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  margin: '0 16px 14px',
  padding: '12px 14px',
  borderRadius: '14px',
  backgroundColor: 'var(--color-primary-surface)',
  border: '1.5px solid var(--color-primary-light, rgba(230, 81, 0, 0.25))',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: '0 2px 10px rgba(230, 81, 0, 0.08)'
};

const iconBadgeStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-elevated)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
};

const textWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1
};

const titleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const titleStyle = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: 'var(--color-primary-dark)',
  lineHeight: 1.2
};

const subTextStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.3,
  margin: 0
};
