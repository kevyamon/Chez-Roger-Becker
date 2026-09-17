/**
 * Section Journal d'Audit & Tracabilite (AdminAuditSection).
 * Consultation des actions de securite et d'administration effectuees.
 */

import React from 'react';
import { History, Shield, Clock } from 'lucide-react';

export const AdminAuditSection = ({ auditLogs = [], isLoading }) => {
  const formatActionName = (action) => {
    switch (action) {
      case 'ADMIN_REGISTERED': return 'Inscription Administrateur';
      case 'DISH_CREATED': return 'Création de Plat';
      case 'DISH_UPDATED': return 'Modification de Plat';
      case 'DRIVER_CREATED': return 'Création Compte Livreur';
      case 'DRIVER_UPDATED': return 'Mise à jour Livreur';
      case 'ORDER_STATUS_UPDATED': return 'Changement Statut Commande';
      case 'RESTAURANT_SETTINGS_UPDATED': return 'Mise à jour Paramètres';
      case 'PROMOTION_CREATED': return 'Création Offre Promo';
      default: return action;
    }
  };

  return (
    <div style={containerStyle}>
      <div className="card-surface" style={headerCardStyle}>
        <div style={headerTitleRowStyle}>
          <div style={iconBadgeStyle}>
            <History size={18} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={titleStyle}>Journal d'Audit & Traçabilité</h3>
            <p style={subtitleStyle}>Historique immuable des opérations sensibles et administratives.</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p style={messageStyle}>Chargement du journal d'audit...</p>
      ) : auditLogs.length === 0 ? (
        <div className="card-surface" style={emptyCardStyle}>
          <Shield size={32} color="var(--text-muted)" />
          <p style={messageStyle}>Aucune action d'audit enregistrée pour le moment.</p>
        </div>
      ) : (
        <div style={logsListStyle}>
          {auditLogs.map((log) => (
            <div key={log._id} className="card-surface" style={logCardStyle}>
              <div style={logHeaderStyle}>
                <span style={actionBadgeStyle}>{formatActionName(log.action)}</span>
                <div style={dateWrapStyle}>
                  <Clock size={12} color="var(--text-muted)" />
                  <span>{new Date(log.createdAt).toLocaleString('fr-FR')}</span>
                </div>
              </div>

              <div style={logBodyStyle}>
                <span style={actorStyle}>
                  Rôle : <strong>{log.actorRole}</strong>
                  {log.actorId?.firstName ? ` (${log.actorId.firstName} ${log.actorId.lastName || ''})` : ''}
                </span>
                <span style={targetStyle}>Cible : {log.targetModel}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const headerCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const headerTitleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const iconBadgeStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const titleStyle = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const subtitleStyle = {
  fontSize: '0.76rem',
  color: 'var(--text-secondary)'
};

const logsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const logCardStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const logHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const actionBadgeStyle = {
  fontSize: '0.74rem',
  fontWeight: 800,
  color: 'var(--color-primary-dark)',
  backgroundColor: 'var(--color-primary-surface)',
  padding: '3px 8px',
  borderRadius: '6px'
};

const dateWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.72rem',
  color: 'var(--text-muted)'
};

const logBodyStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.78rem',
  color: 'var(--text-secondary)'
};

const actorStyle = {
  fontSize: '0.78rem'
};

const targetStyle = {
  fontSize: '0.76rem',
  color: 'var(--text-muted)'
};

const emptyCardStyle = {
  padding: '30px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px'
};

const messageStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-muted)'
};
