/**
 * Carte de commande individuelle pour l'administration (AdminOrderCard).
 * Présente le numéro, client, téléphone, adresse, montant et boutons d'action.
 */

import React from 'react';
import { Phone, MapPin, Eye, Check } from 'lucide-react';

export const AdminOrderCard = ({
  order,
  onSelectOrder,
  onUpdateStatus
}) => {
  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div className="card-surface" style={orderCardStyle}>
      <div style={orderHeaderStyle}>
        <div>
          <span style={orderNumberStyle}>{order.orderNumber}</span>
          <p style={dateStyle}>
            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span style={statusBadgeStyle(order.status)}>{order.status}</span>
      </div>

      <div style={customerInfoStyle}>
        <p style={customerNameStyle}>{order.customer?.firstName} {order.customer?.lastName}</p>
        <div style={infoRowStyle}>
          <Phone size={13} color="var(--color-primary)" />
          <span>{order.customer?.phone}</span>
        </div>
        <div style={infoRowStyle}>
          <MapPin size={13} color="var(--color-primary)" />
          <span style={{ fontSize: '0.78rem' }}>{order.delivery?.address}</span>
        </div>
      </div>

      <div style={orderFooterStyle}>
        <div>
          <span style={totalLabelStyle}>Total commande :</span>
          <strong style={totalPriceStyle}>{formatPrice(order.total)}</strong>
        </div>

        <div style={actionButtonsStyle}>
          <button
            type="button"
            onClick={() => onSelectOrder(order)}
            style={viewButtonStyle}
            title="Voir les détails"
          >
            <Eye size={15} />
            <span>Détails</span>
          </button>

          {order.status === 'PENDING' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order._id, 'CONFIRMED')}
              style={confirmButtonStyle}
            >
              <Check size={14} /> Confirmer
            </button>
          )}
          {order.status === 'CONFIRMED' && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order._id, 'PREPARING')}
              style={confirmButtonStyle}
            >
              Cuisine
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const orderCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const orderHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '8px'
};

const orderNumberStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const dateStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)'
};

const statusBadgeStyle = (status) => ({
  fontSize: '0.7rem',
  fontWeight: 800,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: status === 'DELIVERED' ? 'var(--color-accent-surface)' : 'var(--color-primary-surface)',
  color: status === 'DELIVERED' ? 'var(--color-accent-dark)' : 'var(--color-primary-dark)'
});

const customerInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const customerNameStyle = {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const orderFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '8px',
  borderTop: '1px solid var(--border-color)'
};

const totalLabelStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
  display: 'block'
};

const totalPriceStyle = {
  fontSize: '0.92rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const actionButtonsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const viewButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-card-header)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer'
};

const confirmButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: 'var(--status-success)',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer'
};
