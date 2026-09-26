/**
 * En-tête du Dashboard Administrateur (AdminHeader) Mobile-First.
 * Affiche le levier d'ouverture/fermeture du restaurant, les horaires en base et les actions de profil.
 */

import React from 'react';
import { Power, Sun, Moon, LogOut, ShieldCheck, Store, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const AdminHeader = ({
  restaurantSettings,
  isDark,
  onToggleTheme,
  onToggleStoreStatus,
  isUpdatingStore
}) => {
  const { user, logout } = useAuth();
  const isManuallyOpen = Boolean(restaurantSettings?.isOpen !== false);
  const isEffectivelyOpen = restaurantSettings?.isEffectivelyOpen !== undefined
    ? Boolean(restaurantSettings.isEffectivelyOpen)
    : isManuallyOpen;

  const openingHours = restaurantSettings?.openingHours || 'Mardi – Dimanche : 11h00 – 23h00 (Fermé le lundi)';

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

      {/* Barre d'état d'ouverture et levier d'action */}
      <div style={storeStatusCardStyle}>
        <div style={storeStatusInfoStyle}>
          <div
            style={{
              ...statusIconWrapperStyle,
              backgroundColor: isEffectivelyOpen ? 'var(--color-primary-surface)' : 'var(--bg-elevated)',
              borderColor: isEffectivelyOpen ? 'var(--status-success)' : 'var(--status-error)'
            }}
          >
            <Store size={18} color={isEffectivelyOpen ? 'var(--status-success)' : 'var(--status-error)'} />
          </div>
          <div style={statusTextColStyle}>
            <span style={storeStatusLabelStyle}>
              Restaurant : {isEffectivelyOpen ? 'Ouvert aux commandes' : 'Fermé actuellement'}
            </span>
            <div style={hoursSubRowStyle}>
              <Clock size={12} color="var(--text-muted)" />
              <span style={hoursTextStyle}>{openingHours}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleStoreStatus}
          disabled={isUpdatingStore}
          style={{
            ...toggleButtonStyle,
            backgroundColor: isEffectivelyOpen ? 'var(--status-error)' : 'var(--status-success)',
            opacity: isUpdatingStore ? 0.7 : 1
          }}
        >
          <Power size={14} />
          {isEffectivelyOpen ? 'Fermer le restaurant' : 'Ouvrir le restaurant'}
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
  padding: '12px 14px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  flexWrap: 'wrap',
  gap: '10px'
};

const storeStatusInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flex: 1,
  minWidth: '200px'
};

const statusIconWrapperStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  border: '1.5px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const statusTextColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const storeStatusLabelStyle = {
  fontSize: '0.84rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const hoursSubRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const hoursTextStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
  fontWeight: 600
};

const toggleButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  borderRadius: '10px',
  color: 'var(--color-primary-contrast, #FFFFFF)',
  border: 'none',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
