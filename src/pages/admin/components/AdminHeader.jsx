/**
 * En-tete du Dashboard Administrateur (AdminHeader) Mobile-First.
 * Affiche le statut du restaurant (Ouvert/Ferme), la bascule Jour/Nuit et la deconnexion.
 */

import React from 'react';
import { Power, Sun, Moon, LogOut, ShieldCheck, Store } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const AdminHeader = ({
  restaurantSettings,
  isDark,
  onToggleTheme,
  onToggleStoreStatus,
  isUpdatingStore
}) => {
  const { user, logout } = useAuth();
  const isOpen = Boolean(restaurantSettings?.isOpen);

  return (
    <header className="card-surface" style={headerContainerStyle}>
      <div style={topRowStyle}>
        <div style={badgeProfileStyle}>
          <div style={avatarStyle}>
            <ShieldCheck size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 style={adminNameStyle}>{user?.firstName || 'Admin'} {user?.lastName || 'Roger Becker'}</h2>
            <span style={roleBadgeStyle}>Super Administrateur</span>
          </div>
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onToggleTheme}
            style={actionIconButtonStyle}
            title={isDark ? 'Passer en mode Jour' : 'Passer en mode Nuit'}
            aria-label="Basculer le thème"
          >
            {isDark ? <Sun size={18} color="var(--color-secondary-light)" /> : <Moon size={18} color="var(--text-secondary)" />}
          </button>

          <button
            type="button"
            onClick={logout}
            style={actionIconButtonStyle}
            title="Se déconnecter"
            aria-label="Se déconnecter"
          >
            <LogOut size={18} color="var(--status-error)" />
          </button>
        </div>
      </div>

      {/* Barre d'etat d'ouverture du restaurant */}
      <div style={storeStatusCardStyle}>
        <div style={storeStatusInfoStyle}>
          <Store size={18} color={isOpen ? 'var(--status-success)' : 'var(--status-error)'} />
          <div>
            <span style={storeStatusLabelStyle}>
              Restaurant : {isOpen ? 'Ouvert aux commandes' : 'Fermé actuellement'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleStoreStatus}
          disabled={isUpdatingStore}
          style={{
            ...toggleButtonStyle,
            backgroundColor: isOpen ? 'var(--status-error)' : 'var(--status-success)',
            opacity: isUpdatingStore ? 0.7 : 1
          }}
        >
          <Power size={14} />
          {isOpen ? 'Fermer le restaurant' : 'Ouvrir le restaurant'}
        </button>
      </div>
    </header>
  );
};

const headerContainerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const topRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const badgeProfileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const adminNameStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.2
};

const roleBadgeStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--color-primary-dark)',
  textTransform: 'uppercase'
};

const actionsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const actionIconButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-card-header)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.15s ease'
};

const storeStatusCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  flexWrap: 'wrap',
  gap: '8px'
};

const storeStatusInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const storeStatusLabelStyle = {
  fontSize: '0.84rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const toggleButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '8px',
  color: '#FFFFFF',
  border: 'none',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
