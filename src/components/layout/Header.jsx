/**
 * En-tête de l'application Chez Roger Becker.
 * Affiche le statut d'ouverture, le logo et le bouton de bascule clair/sombre.
 */

import React from 'react';
import { Sun, Moon, Flame, Shield, Bike } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ restaurantInfo, onOpenMenu }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAdmin, isDriver } = useAuth();

  const isOpen = restaurantInfo?.isOpen !== false;

  return (
    <header style={headerStyle}>
      <div style={brandContainerStyle}>
        <div style={logoIconStyle}>
          <Flame size={20} color="#FFFFFF" />
        </div>
        <div>
          <h1 style={titleStyle}>Chez Roger Becker</h1>
          <div style={statusRowStyle}>
            <span style={{ ...statusDotStyle, backgroundColor: isOpen ? '#16A34A' : '#DC2626' }} />
            <span style={statusTextStyle}>
              {isOpen ? 'Restaurant Ouvert' : 'Actuellement Fermé'}
            </span>
          </div>
        </div>
      </div>

      <div style={actionsContainerStyle}>
        {isAdmin && (
          <span style={badgeAdminStyle}>
            <Shield size={13} /> Admin
          </span>
        )}
        {isDriver && (
          <span style={badgeDriverStyle}>
            <Bike size={13} /> Livreur
          </span>
        )}
        <button
          onClick={toggleTheme}
          style={themeButtonStyle}
          aria-label="Basculer le mode d'affichage"
        >
          {isDarkMode ? <Sun size={19} color="#FBBF24" /> : <Moon size={19} color="#475569" />}
        </button>
      </div>
    </header>
  );
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

const logoIconStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(230, 81, 0, 0.35)'
};

const titleStyle = {
  fontSize: '1.15rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.1
};

const statusRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '2px'
};

const statusDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%'
};

const statusTextStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  fontWeight: 600
};

const actionsContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const themeButtonStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--bg-elevated)'
};

const badgeAdminStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '4px 8px',
  borderRadius: '8px',
  backgroundColor: 'var(--color-accent-surface)',
  color: 'var(--color-accent-dark)'
};

const badgeDriverStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '4px 8px',
  borderRadius: '8px',
  backgroundColor: 'var(--color-secondary-surface)',
  color: 'var(--color-secondary-dark)'
};
