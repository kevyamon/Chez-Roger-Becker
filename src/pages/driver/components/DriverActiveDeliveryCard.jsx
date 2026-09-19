/**
 * Carte de gestion de la course active du livreur (DriverActiveDeliveryCard).
 * Propose le contact client, la navigation GPS externe et le changement d'étape.
 */

import React from 'react';
import { Bike, Navigation, Phone, CheckCircle2, Package } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { theme } from '../../../styles/theme';
import { getOrderStatusLabel, getOrderStatusBadgeStyle } from '../../../utils/statusLabels';

export const DriverActiveDeliveryCard = ({
  delivery,
  onAction,
  onOpenNavigation
}) => {
  return (
    <div className="card-surface" style={deliveryCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={orderBadgeStyle}>#{delivery.orderNumber}</span>
        <span style={{ ...getOrderStatusBadgeStyle(delivery.status), fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: theme.radii.sm }}>
          {getOrderStatusLabel(delivery.status)}
        </span>
      </div>

      <div style={infoGroupStyle}>
        <p style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
          {delivery.customer?.name}
        </p>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          {delivery.delivery?.address}
        </p>
      </div>

      <div style={actionRowStyle}>
        {delivery.customer?.phone && (
          <a
            href={`tel:${delivery.customer.phone}`}
            style={callBtnStyle}
            title="Appeler le client"
          >
            <Phone size={16} /> Appeler le client
          </a>
        )}
        <button
          onClick={() => onOpenNavigation(delivery.delivery?.location?.coordinates)}
          style={navBtnStyle}
          type="button"
        >
          <Navigation size={16} /> Itinéraire
        </button>
      </div>

      {delivery.status === 'ASSIGNED' && (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={() => onAction(delivery._id, 'picked-up', 'Repas récupéré en cuisine !')}
          icon={Package}
          style={{ marginTop: '8px' }}
        >
          Je récupère la commande
        </Button>
      )}

      {delivery.status === 'PICKED_UP' && (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onAction(delivery._id, 'out-for-delivery', 'En route vers le client !')}
          icon={Bike}
          style={{ marginTop: '8px' }}
        >
          Démarrer la livraison
        </Button>
      )}

      {delivery.status === 'OUT_FOR_DELIVERY' && (
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onAction(delivery._id, 'delivered', 'Course confirmée et livrée avec succès !')}
          icon={CheckCircle2}
          style={{ marginTop: '8px', backgroundColor: 'var(--status-success)' }}
        >
          Confirmer la livraison
        </Button>
      )}
    </div>
  );
};

const deliveryCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  border: '1.5px solid var(--color-secondary)',
  borderRadius: theme.radii.md
};

const orderBadgeStyle = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const infoGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const actionRowStyle = {
  display: 'flex',
  gap: '8px'
};

const callBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  backgroundColor: 'var(--color-accent)',
  color: '#FFFFFF',
  padding: '9px 12px',
  borderRadius: theme.radii.sm,
  fontSize: '0.82rem',
  fontWeight: 700,
  textDecoration: 'none'
};

const navBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1.5px solid var(--border-color)',
  color: 'var(--text-primary)',
  padding: '9px 12px',
  borderRadius: theme.radii.sm,
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer'
};
