/**
 * En-tête de l'application Chez Roger Becker.
 * Affiche le statut d'ouverture, le logo, l'accès pro/livreur et le bouton de bascule clair/sombre.
 */

import React from 'react';
import { Sun, Moon, Shield, Bike } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { checkIsRestaurantOpen } from '../../utils/scheduleHelper';
import logoImg from '../../assets/images/logo.png';

const statusBadgeContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '3px 8px',
  borderRadius: '9999px',
  marginTop: '3px',
  fontSize: '0.72rem',
  fontWeight: 700,
  transition: 'all 0.3s ease'
};

const statusDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  flexShrink: 0
};

const statusTextStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  lineHeight: 1
};

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 80,
  backgroundColor: 'var(--bg-primary)',
  borderBottom: '1px solid var(--border-color)',
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backdropFilter: 'blur(12px)'
};

const brandContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const logoImgStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  objectFit: 'contain',
  backgroundColor: 'var(--bg-elevated)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
};

const titleStyle = {
  fontSize: '1.15rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.1
};

const actionsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const themeButtonStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--bg-elevated)',
  cursor: 'pointer'
};

const badgeAdminStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '6px 10px',
  borderRadius: '8px',
  backgroundColor: 'var(--color-accent-surface, rgba(2, 132, 199, 0.12))',
  color: 'var(--color-accent-dark, #0284C7)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer'
};

const badgeDriverStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '6px 10px',
  borderRadius: '8px',
  backgroundColor: 'var(--color-secondary-surface, rgba(230, 81, 0, 0.12))',
  color: 'var(--color-secondary-dark, #E65100)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer'
};

export const Header = ({ restaurantInfo, onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAdmin, isDriver } = useAuth();

  const { isOpen, statusText } = checkIsRestaurantOpen(restaurantInfo);

  return (
    <header style={headerStyle}>
      <div style={brandContainerStyle}>
        <img
          src={logoImg}
          alt="Chez Roger Becker"
          style={logoImgStyle}
        />
        <div>
          <h1 style={titleStyle}>Chez Roger Becker</h1>
          <div
            style={{
              ...statusBadgeContainerStyle,
              backgroundColor: isOpen ? 'rgba(22, 163, 74, 0.10)' : 'rgba(220, 38, 38, 0.10)',
              border: `1px solid ${isOpen ? 'rgba(22, 163, 74, 0.25)' : 'rgba(220, 38, 38, 0.25)'}`,
              color: isOpen ? 'var(--status-success)' : 'var(--status-error)'
            }}
          >
            <span
              style={{
                ...statusDotStyle,
                backgroundColor: isOpen ? 'var(--status-success)' : 'var(--status-error)',
                boxShadow: isOpen ? '0 0 6px rgba(22, 163, 74, 0.6)' : '0 0 6px rgba(220, 38, 38, 0.6)'
              }}
            />
            <span style={statusTextStyle}>
              {statusText}
            </span>
          </div>
        </div>
      </div>

      <div style={actionsContainerStyle}>
        {isAdmin && onNavigate && (
          <button
            onClick={() => onNavigate('auth')}
            style={badgeAdminStyle}
            title="Accéder au tableau de bord administrateur"
          >
            <Shield size={13} /> Admin
          </button>
        )}
        {isDriver && onNavigate && (
          <button
            onClick={() => onNavigate('auth')}
            style={badgeDriverStyle}
            title="Accéder au tableau de bord livreur"
          >
            <Bike size={13} /> Livreur
          </button>
        )}
        <button
          onClick={toggleTheme}
          style={themeButtonStyle}
          aria-label="Basculer le mode d'affichage"
        >
          {isDarkMode ? (
            <Sun size={19} color="var(--color-secondary-light)" />
          ) : (
            <Moon size={19} color="var(--text-secondary)" />
          )}
        </button>
      </div>
    </header>
  );
};
