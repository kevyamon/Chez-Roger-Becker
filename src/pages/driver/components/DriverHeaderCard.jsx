/**
 * En-tête du tableau de bord livreur (DriverHeaderCard).
 * Affiche le profil, le bouton de déconnexion, le sélecteur de statut et la bannière push.
 */

import React from 'react';
import { Power } from 'lucide-react';
import { NotificationPermissionBanner } from '../../../components/ui/NotificationPermissionBanner';
import { theme } from '../../../styles/theme';

export const DriverHeaderCard = ({
  user,
  driverStatus,
  onToggleStatus,
  onLogout
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="card-surface" style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Espace Livreur
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Bonjour, {user?.firstName}
            </h3>
          </div>
          <button
            onClick={onLogout}
            style={logoutBtnStyle}
            title="Déconnexion"
            aria-label="Déconnexion"
          >
            <Power size={18} color="var(--status-error)" />
          </button>
        </div>

        <div style={statusToggleRowStyle}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Disponibilité :
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['AVAILABLE', 'OFFLINE'].map((st) => {
              const isSelected = driverStatus === st;
              const bgActive = st === 'AVAILABLE' ? 'var(--status-success)' : 'var(--text-muted)';
              return (
                <button
                  key={st}
                  onClick={() => onToggleStatus(st)}
                  style={{
                    ...statusBtnStyle,
                    backgroundColor: isSelected ? bgActive : 'var(--bg-elevated)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)'
                  }}
                >
                  {st === 'AVAILABLE' ? 'En ligne' : 'Hors ligne'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bannière d'incitation aux notifications push pour le livreur */}
      <NotificationPermissionBanner role="DRIVER" />
    </div>
  );
};

const headerCardStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  borderRadius: theme.radii.md
};

const logoutBtnStyle = {
  padding: '8px',
  borderRadius: theme.radii.sm,
  border: '1px solid var(--border-color)',
  background: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statusToggleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '10px',
  borderTop: '1px solid var(--border-color)'
};

const statusBtnStyle = {
  padding: '6px 12px',
  borderRadius: theme.radii.sm,
  fontSize: '0.78rem',
  fontWeight: 700,
  border: '1px solid var(--border-color)',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
