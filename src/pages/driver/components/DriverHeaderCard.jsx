/**
 * En-tête du tableau de bord livreur (DriverHeaderCard).
 * Affiche le profil, le bouton d'édition de compte, le sélecteur de statut et la bannière push.
 */

import React from 'react';
import { Power, UserCircle } from 'lucide-react';
import { NotificationPermissionBanner } from '../../../components/ui/NotificationPermissionBanner';
import { Button } from '../../../components/ui/Button';
import { theme } from '../../../styles/theme';

export const DriverHeaderCard = ({
  user,
  driverStatus,
  onToggleStatus,
  onOpenProfile,
  onLogout
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="card-surface" style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Espace Livreur Officiel
            </span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {user?.firstName} {user?.lastName}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              icon={UserCircle}
              onClick={onOpenProfile}
            >
              Mon Compte
            </Button>
            <button
              onClick={onLogout}
              style={logoutBtnStyle}
              title="Déconnexion"
              aria-label="Déconnexion"
            >
              <Power size={18} color="var(--status-error)" />
            </button>
          </div>
        </div>

        <div style={statusToggleRowStyle}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Disponibilité :
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['AVAILABLE', 'OFFLINE'].map((st) => {
              const isSelected = driverStatus === st;
              const bgActive = st === 'AVAILABLE' ? 'var(--status-success, #16A34A)' : 'var(--text-muted)';
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
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
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
