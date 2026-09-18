/**
 * Liste des commandes disponibles en attente de prise en charge par un livreur (DriverAvailableOrdersList).
 */

import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { theme } from '../../../styles/theme';

export const DriverAvailableOrdersList = ({
  orders = [],
  onAcceptOrder,
  onRefresh,
  isLoading = false
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Commandes Disponibles ({orders.length})
        </h4>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          style={refreshBtnStyle}
          title="Actualiser la liste"
          aria-label="Actualiser"
        >
          <RefreshCw
            size={16}
            color="var(--text-muted)"
            className={isLoading ? 'animate-spin' : ''}
            style={isLoading ? { animation: 'spin 1s linear infinite' } : {}}
          />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="card-surface" style={emptyCardStyle}>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Aucune commande en attente de livraison pour le moment.
          </p>
        </div>
      ) : (
        orders.map((ord) => (
          <div key={ord._id} className="card-surface" style={availableCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={orderBadgeStyle}>#{ord.orderNumber}</span>
              <span style={priceStyle}>
                {ord.total?.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <p style={addressStyle}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {ord.delivery?.address}
            </p>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => onAcceptOrder(ord._id)}
              style={{ marginTop: '10px' }}
            >
              Accepter la livraison
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

const refreshBtnStyle = {
  padding: '6px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyCardStyle = {
  padding: '24px',
  textAlign: 'center',
  borderRadius: theme.radii.md
};

const availableCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  borderRadius: theme.radii.md
};

const orderBadgeStyle = {
  fontSize: '0.84rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const priceStyle = {
  fontWeight: 800,
  color: 'var(--color-primary)',
  fontSize: '0.92rem'
};

const addressStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)',
  marginTop: '4px'
};
