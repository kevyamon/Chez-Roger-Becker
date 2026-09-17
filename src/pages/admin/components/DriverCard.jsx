/**
 * Carte individuelle affichant les détails d'un livreur et son statut.
 */

import React from 'react';
import { Bike, Phone, Mail } from 'lucide-react';

export const DriverCard = ({ driver }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { label: 'Disponible', bg: 'var(--color-accent-surface)', color: 'var(--color-accent-dark)' };
      case 'BUSY':
        return { label: 'En course', bg: 'var(--color-primary-surface)', color: 'var(--color-primary-dark)' };
      default:
        return { label: 'Hors ligne', bg: 'var(--bg-card-header)', color: 'var(--text-muted)' };
    }
  };

  const badge = getStatusBadge(driver.driverStatus);

  return (
    <div className="card-surface" style={driverCardStyle}>
      <div style={driverHeaderStyle}>
        <div style={driverNameWrapStyle}>
          <div style={avatarStyle}>
            <Bike size={18} color="var(--color-primary)" />
          </div>
          <div>
            <h4 style={driverNameStyle}>{driver.firstName} {driver.lastName}</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Livreur officiel</span>
          </div>
        </div>
        <span style={{ ...statusBadgeStyle, backgroundColor: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>

      <div style={driverDetailsStyle}>
        <div style={infoRowStyle}>
          <Phone size={13} color="var(--color-primary)" />
          <a href={`tel:${driver.phone}`} style={linkStyle}>{driver.phone}</a>
        </div>
        <div style={infoRowStyle}>
          <Mail size={13} color="var(--color-primary)" />
          <span>{driver.email}</span>
        </div>
      </div>
    </div>
  );
};

const driverCardStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const driverHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const driverNameWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const avatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const driverNameStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const statusBadgeStyle = {
  fontSize: '0.7rem',
  fontWeight: 800,
  padding: '3px 8px',
  borderRadius: '6px'
};

const driverDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  paddingTop: '8px',
  borderTop: '1px solid var(--border-color)'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.78rem',
  color: 'var(--text-secondary)'
};

const linkStyle = {
  color: 'var(--color-primary)',
  fontWeight: 700,
  textDecoration: 'none'
};
