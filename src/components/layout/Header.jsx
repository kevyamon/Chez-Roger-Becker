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

const statusDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  flexShrink: 0
};

const statusTextStyle = {
  fontSize: '0.68rem',
  fontWeight: 700,
  lineHeight: 1
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
  gap: '5px',
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
  const { isAdmin, isDriver } = useAuth();

  const { isOpen } = checkIsRestaurantOpen(restaurantInfo);

  return (
    <header className="app-header">
      <div className="header-brand">
        <img
          src={logoImg}
          alt="Chez Roger Becker"
          className="header-logo"
        />
        <div className="header-brand-info">
          <h1 className="header-title">Chez Roger Becker</h1>
          <div
            className="header-status-badge"
            style={{
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
              {isOpen ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {isAdmin && onNavigate && (
          <button
            onClick={() => onNavigate('auth-admin')}
            style={badgeAdminStyle}
            title="Accéder au tableau de bord administrateur"
          >
            <Shield size={13} /> Admin
          </button>
        )}
        {isDriver && onNavigate && (
          <button
            onClick={() => onNavigate('driver-login')}
            style={badgeDriverStyle}
            title="Accéder au tableau de bord livreur"
          >
            <Bike size={14} />
            <span className="livreur-text-full">Espace Livreur</span>
            <span className="livreur-text-short">Livreur</span>
          </button>
        )}
        {!isAdmin && !isDriver && onNavigate && (
          <button
            onClick={() => onNavigate('driver-login')}
            className="header-livreur-btn"
            title="Accéder à l'espace livreur"
          >
            <Bike size={14} />
            <span className="livreur-text-full">Espace Livreur</span>
            <span className="livreur-text-short">Livreur</span>
          </button>
        )}
        <button
          onClick={toggleTheme}
          className="header-theme-btn"
          aria-label="Basculer le mode d'affichage"
        >
          {isDarkMode ? (
            <Sun size={18} color="var(--color-secondary-light)" />
          ) : (
            <Moon size={18} color="var(--text-secondary)" />
          )}
        </button>
      </div>
    </header>
  );
};
