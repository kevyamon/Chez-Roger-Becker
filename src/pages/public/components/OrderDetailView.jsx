/**
 * Vue détaillée d'une commande avec timeline et suivi cartographique (OrderDetailView).
 */

import React, { useEffect } from 'react';
import { Bike, Phone, ArrowLeft, RefreshCw, MapPin } from 'lucide-react';
import { socket, joinOrderRoom } from '../../../services/socket';
import { MapPicker } from '../../../components/map/MapPicker';
import { OrderTimelineCard } from './OrderTimelineCard';
import { OrderItemsCard } from './OrderItemsCard';

export const OrderDetailView = ({
  order,
  onBack,
  onRefresh,
  onUpdateOrder
}) => {
  useEffect(() => {
    if (order?.trackingToken) {
      joinOrderRoom(order.trackingToken);

      const handleStatusChange = (updatedData) => {
        if (
          onUpdateOrder &&
          (updatedData.trackingToken === order.trackingToken ||
            updatedData.orderId === order._id ||
            updatedData.orderNumber === order.orderNumber)
        ) {
          onUpdateOrder((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              status: updatedData.status,
              statusHistory: updatedData.statusHistory || prev.statusHistory,
              driverId: updatedData.driver || prev.driverId
            };
          });
        }
      };

      socket.on('order:status-changed', handleStatusChange);
      return () => {
        socket.off('order:status-changed', handleStatusChange);
      };
    }
  }, [order?.trackingToken, order?._id, order?.orderNumber, onUpdateOrder]);

  const isDelivering = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order?.status);

  return (
    <div style={containerStyle}>
      {/* 1. BARRE DE NAVIGATION SUPÉRIEURE */}
      <div style={topNavStyle}>
        <button onClick={onBack} style={backBtnStyle}>
          <ArrowLeft size={18} /> Retour à mes commandes
        </button>
        <button onClick={onRefresh} style={refreshBtnStyle} title="Actualiser la commande">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* 2. RÉSUMÉ DE LA COMMANDE */}
      <div className="card-surface" style={summaryCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={labelStyle}>Numéro de commande</span>
            <h3 style={orderNumberStyle}>{order.orderNumber}</h3>
          </div>
          <span style={statusBadgeStyle}>{order.status}</span>
        </div>
      </div>

      {/* 3. TIMELINE DES ÉTAPES */}
      <OrderTimelineCard currentStatus={order.status} />

      {/* 4. CARTE DE SUIVI EN DIRECT (SI EN LIVRAISON OU COORDONNÉES PRÉSENTES) */}
      {order.delivery?.location?.coordinates && (
        <div className="card-surface" style={mapCardStyle}>
          <div style={mapHeaderStyle}>
            <MapPin size={18} color="var(--color-primary)" />
            <h4 style={sectionTitleStyle}>
              {isDelivering ? 'Suivi de la livraison sur la carte' : 'Lieu de livraison'}
            </h4>
          </div>
          <MapPicker location={order.delivery.location} readOnly={true} />
          <p style={addressTextStyle}>{order.delivery.address}</p>
        </div>
      )}

      {/* 5. LIVREUR ASSIGNÉ */}
      {order.driverId && (
        <div className="card-surface" style={driverCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={driverAvatarStyle}>
              <Bike size={22} color="var(--color-secondary)" />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>Votre Livreur</span>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800 }}>
                {order.driverId.firstName} {order.driverId.lastName}
              </h4>
            </div>
          </div>
          {order.driverId.phone && (
            <a href={`tel:${order.driverId.phone}`} style={callBtnStyle}>
              <Phone size={16} /> Appeler
            </a>
          )}
        </div>
      )}

      {/* 6. ARTICLES DE LA COMMANDE */}
      <OrderItemsCard items={order.items} total={order.total} />
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const topNavStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const backBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  fontSize: '0.84rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const refreshBtnStyle = {
  padding: '6px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: 'var(--text-muted)',
  cursor: 'pointer'
};

const summaryCardStyle = {
  padding: '16px 18px'
};

const labelStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-muted)',
  fontWeight: 700,
  textTransform: 'uppercase'
};

const orderNumberStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const statusBadgeStyle = {
  backgroundColor: 'var(--color-primary-surface)',
  color: 'var(--color-primary-dark)',
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 800
};

const sectionTitleStyle = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const mapCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const mapHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const addressTextStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  marginTop: '-6px'
};

const driverCardStyle = {
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const driverAvatarStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-secondary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const callBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-accent-contrast, #FFFFFF)',
  padding: '8px 14px',
  borderRadius: '10px',
  fontSize: '0.82rem',
  fontWeight: 700,
  textDecoration: 'none',
  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
};
