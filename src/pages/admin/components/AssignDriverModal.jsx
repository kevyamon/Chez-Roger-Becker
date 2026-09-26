/**
 * Modale de sélection et d'assignation d'un livreur disponible (AssignDriverModal).
 * Affiche strictement les livreurs actuellement connectés (en ligne).
 */

import React, { useState } from 'react';
import { X, Bike, Phone, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { theme } from '../../../styles/theme';

export const AssignDriverModal = ({ isOpen, onClose, order, drivers = [], onAssignDriver }) => {
  const [assigningId, setAssigningId] = useState(null);

  if (!isOpen || !order) return null;

  // Filtrage strict : seuls les livreurs en ligne et actifs sont proposés
  const availableDrivers = drivers.filter(
    (d) => d.role === 'DRIVER' && d.isActive !== false && d.driverStatus === 'AVAILABLE'
  );

  const handleAssign = async (driverId) => {
    try {
      setAssigningId(driverId);
      await onAssignDriver(order._id, driverId);
      onClose();
    } catch {
      // Les notifications d'erreur sont prises en charge par le hook
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={iconBoxStyle}>
              <Bike size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h3 style={titleStyle}>Attribuer un livreur</h3>
              <p style={subtitleStyle}>Commande #{order.orderNumber} • {availableDrivers.length} livreur(s) en ligne</p>
            </div>
          </div>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fermer la modale">
            <X size={20} />
          </button>
        </div>

        {/* Corps */}
        <div style={bodyStyle}>
          {availableDrivers.length === 0 ? (
            <div style={emptyBoxStyle}>
              <AlertCircle size={36} color="var(--status-warning, #D97706)" />
              <h4 style={emptyTitleStyle}>Aucun livreur en ligne pour le moment</h4>
              <p style={emptyDescStyle}>
                Seuls les coursiers connectés et ayant activé leur disponibilité apparaissent ici.
                Veuillez demander à un livreur de se connecter sur son tableau de bord.
              </p>
            </div>
          ) : (
            <div style={listStyle}>
              {availableDrivers.map((driver) => {
                const isAssigning = assigningId === driver._id;
                const isAlreadySelected = order.driverId?._id === driver._id || order.driverId === driver._id;

                return (
                  <div key={driver._id} style={driverCardStyle}>
                    <div style={driverInfoColStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={onlineDotStyle} title="En ligne" />
                        <strong style={driverNameStyle}>
                          {driver.firstName} {driver.lastName}
                        </strong>
                        {isAlreadySelected && (
                          <span style={currentBadgeStyle}>Actuel</span>
                        )}
                      </div>

                      <div style={phoneRowStyle}>
                        <Phone size={13} color="var(--color-primary)" />
                        <a href={`tel:${driver.phone}`} style={phoneLinkStyle}>
                          {driver.phone}
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAssigning || Boolean(assigningId)}
                      onClick={() => handleAssign(driver._id)}
                      style={isAlreadySelected ? assignedButtonStyle : assignButtonStyle}
                    >
                      {isAssigning ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          <span>Attribution...</span>
                        </>
                      ) : isAlreadySelected ? (
                        <>
                          <UserCheck size={15} />
                          <span>Réassigner</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={15} />
                          <span>Désigner</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '16px'
};

const modalContainerStyle = {
  backgroundColor: 'var(--bg-elevated)',
  borderRadius: theme.radii.lg,
  maxWidth: '480px',
  width: '100%',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--bg-card-header)'
};

const iconBoxStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const titleStyle = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const subtitleStyle = {
  margin: '2px 0 0',
  fontSize: '0.78rem',
  color: 'var(--text-muted)'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const bodyStyle = {
  padding: '18px 20px',
  overflowY: 'auto'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const driverCardStyle = {
  padding: '12px 14px',
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: theme.radii.md,
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px'
};

const driverInfoColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const onlineDotStyle = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'var(--status-success)',
  display: 'inline-block'
};

const driverNameStyle = {
  fontSize: '0.92rem',
  color: 'var(--text-primary)'
};

const currentBadgeStyle = {
  fontSize: '0.68rem',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: '6px',
  backgroundColor: 'var(--color-primary-surface)',
  color: 'var(--color-primary)'
};

const phoneRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.82rem'
};

const phoneLinkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontWeight: 600
};

const assignButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  borderRadius: '8px',
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  border: 'none',
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  flexShrink: 0
};

const assignedButtonStyle = {
  ...assignButtonStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)'
};

const emptyBoxStyle = {
  padding: '30px 16px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px'
};

const emptyTitleStyle = {
  margin: 0,
  fontSize: '0.96rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const emptyDescStyle = {
  margin: 0,
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  maxWidth: '340px'
};
