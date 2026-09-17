/**
 * Liste de l'historique des commandes locales (OrderHistoryList).
 * Permet de visualiser et de sélectionner les commandes passées depuis ce navigateur.
 */

import React from 'react';
import { PackageCheck, ChevronRight, Clock, Trash2, UtensilsCrossed } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const STATUS_LABELS = {
  PENDING: { label: 'En attente', bg: 'var(--color-primary-surface)', color: 'var(--color-primary-dark)' },
  CONFIRMED: { label: 'Confirmée', bg: 'var(--color-accent-surface)', color: 'var(--color-accent-dark)' },
  PREPARING: { label: 'En préparation', bg: 'var(--color-secondary-surface)', color: 'var(--color-secondary-dark)' },
  READY_FOR_PICKUP: { label: 'Prête', bg: 'var(--color-secondary-surface)', color: 'var(--color-secondary-dark)' },
  ASSIGNED: { label: 'Livreur assigné', bg: 'var(--color-accent-surface)', color: 'var(--color-accent-dark)' },
  PICKED_UP: { label: 'Récupérée', bg: 'var(--color-accent-surface)', color: 'var(--color-accent-dark)' },
  OUT_FOR_DELIVERY: { label: 'En livraison', bg: 'var(--color-primary-surface)', color: 'var(--color-primary)' },
  DELIVERED: { label: 'Livrée', bg: 'rgba(22, 163, 74, 0.12)', color: 'var(--status-success)' },
  CANCELLED: { label: 'Annulée', bg: 'rgba(220, 38, 38, 0.12)', color: 'var(--status-error)' }
};

export const OrderHistoryList = ({
  orders = [],
  onSelectOrder,
  onClearHistory,
  onNavigate
}) => {
  if (orders.length === 0) {
    return (
      <div className="card-surface" style={emptyCardStyle}>
        <div style={emptyIconCircleStyle}>
          <PackageCheck size={40} color="var(--color-primary)" />
        </div>
        <h3 style={emptyTitleStyle}>Aucune commande enregistrée</h3>
        <p style={emptyDescStyle}>
          Vos futures commandes apparaîtront automatiquement ici pour vous permettre de les suivre sans avoir à mémoriser vos numéros.
        </p>
        <Button variant="primary" size="md" onClick={() => onNavigate('menu')} style={{ marginTop: '8px' }}>
          Découvrir le menu
        </Button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Commandes récentes ({orders.length})</h3>
        {onClearHistory && (
          <button onClick={onClearHistory} style={clearHistoryBtnStyle} title="Effacer l'historique">
            <Trash2 size={14} /> Effacer
          </button>
        )}
      </div>

      <div style={listStyle}>
        {orders.map((item) => {
          const statusConfig = STATUS_LABELS[item.status] || {
            label: item.status || 'En cours',
            bg: 'var(--color-primary-surface)',
            color: 'var(--color-primary)'
          };

          const formattedDate = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })
            : '';

          return (
            <div
              key={item.trackingToken || item.orderNumber}
              className="card-surface"
              onClick={() => onSelectOrder(item.trackingToken || item.orderNumber)}
              style={cardItemStyle}
            >
              <div style={topRowStyle}>
                <div>
                  <span style={orderNumberStyle}>{item.orderNumber}</span>
                  {formattedDate && (
                    <div style={dateRowStyle}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span>{formattedDate}</span>
                    </div>
                  )}
                </div>
                <span
                  style={{
                    ...badgeStyle,
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.color
                  }}
                >
                  {statusConfig.label}
                </span>
              </div>

              <div style={bottomRowStyle}>
                <div style={itemsCountStyle}>
                  <UtensilsCrossed size={14} color="var(--text-muted)" />
                  <span>
                    {item.itemsCount ? `${item.itemsCount} article${item.itemsCount > 1 ? 's' : ''}` : item.firstItemName || 'Détails'}
                  </span>
                </div>
                <div style={priceContainerStyle}>
                  <span style={priceStyle}>
                    {item.total ? `${Number(item.total).toLocaleString('fr-FR')} FCFA` : ''}
                  </span>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2px'
};

const titleStyle = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const clearHistoryBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--status-error)',
  fontSize: '0.76rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const cardItemStyle = {
  padding: '14px 16px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const topRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start'
};

const orderNumberStyle = {
  fontSize: '1.02rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const dateRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  marginTop: '2px'
};

const badgeStyle = {
  padding: '3px 9px',
  borderRadius: '8px',
  fontSize: '0.72rem',
  fontWeight: 800
};

const bottomRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '8px',
  borderTop: '1px solid var(--border-color)'
};

const itemsCountStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.80rem',
  color: 'var(--text-secondary)'
};

const priceContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
};

const priceStyle = {
  fontSize: '0.94rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const emptyCardStyle = {
  padding: '40px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px'
};

const emptyIconCircleStyle = {
  width: '74px',
  height: '74px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const emptyDescStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)',
  maxWidth: '320px',
  lineHeight: 1.45
};
