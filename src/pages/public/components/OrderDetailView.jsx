/**
 * Vue détaillée d'une commande avec timeline et suivi cartographique (OrderDetailView).
 */

import React, { useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Bike,
  Phone,
  ArrowLeft,
  RefreshCw,
  MapPin,
  Utensils
} from 'lucide-react';
import { socket, joinOrderRoom } from '../../../services/socket';
import { MapPicker } from '../../../components/map/MapPicker';

const STEPS = [
  { key: 'PENDING', label: 'Commande reçue', desc: 'En attente de confirmation' },
  { key: 'CONFIRMED', label: 'Commande confirmée', desc: 'Validée par le restaurant' },
  { key: 'PREPARING', label: 'Préparation en cours', desc: 'Nos cuisiniers préparent votre plat' },
  { key: 'READY_FOR_PICKUP', label: 'Prête pour livraison', desc: 'Prête pour le départ' },
  { key: 'OUT_FOR_DELIVERY', label: 'En cours de livraison', desc: 'Le livreur est en route' },
  { key: 'DELIVERED', label: 'Commande livrée', desc: 'Bon appétit !' }
];

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
        if (onUpdateOrder) {
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
  }, [order?.trackingToken, onUpdateOrder]);

  const getStepIndex = (status) => {
    if (['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(status)) return 4;
    if (status === 'DELIVERED') return 5;
    const idx = STEPS.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;
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
      <div className="card-surface" style={timelineCardStyle}>
        <h4 style={sectionTitleStyle}>Progression de la commande</h4>
        <div style={timelineStyle}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} style={timelineItemStyle}>
                <div style={iconColStyle}>
                  <div
                    style={{
                      ...stepCircleStyle,
                      backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--border-color)',
                      color: isCompleted ? 'var(--color-primary-contrast, #FFFFFF)' : 'var(--text-muted)'
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : <Clock size={14} />}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      style={{
                        ...stepLineStyle,
                        backgroundColor: idx < currentStepIdx ? 'var(--color-primary)' : 'var(--border-color)'
                      }}
                    />
                  )}
                </div>
                <div style={stepContentStyle}>
                  <p style={{ ...stepHeadingStyle, color: isCurrent ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                    {step.label}
                  </p>
                  <p style={stepDescStyle}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
      {order.items && order.items.length > 0 && (
        <div className="card-surface" style={itemsCardStyle}>
          <div style={itemsHeaderStyle}>
            <Utensils size={18} color="var(--color-primary)" />
            <h4 style={sectionTitleStyle}>Articles commandés ({order.items.length})</h4>
          </div>
          <div style={itemsListStyle}>
            {order.items.map((item, idx) => (
              <div key={idx} style={itemRowStyle}>
                <div>
                  <span style={itemNameStyle}>{item.quantity}x {item.name}</span>
                </div>
                <span style={itemPriceStyle}>{((item.subtotal || item.unitPrice * item.quantity)).toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
            <div style={totalRowStyle}>
              <span>Total réglé / à régler</span>
              <span style={totalPriceStyle}>{order.total?.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>
      )}
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

const timelineCardStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const sectionTitleStyle = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const timelineStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const timelineItemStyle = {
  display: 'flex',
  gap: '14px',
  minHeight: '48px'
};

const iconColStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '28px'
};

const stepCircleStyle = {
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const stepLineStyle = {
  width: '2px',
  flex: 1,
  margin: '4px 0'
};

const stepContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '16px'
};

const stepHeadingStyle = {
  fontSize: '0.88rem',
  fontWeight: 700
};

const stepDescStyle = {
  fontSize: '0.76rem',
  color: 'var(--text-secondary)'
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

const itemsCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const itemsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.84rem'
};

const itemNameStyle = {
  color: 'var(--text-primary)',
  fontWeight: 600
};

const itemPriceStyle = {
  color: 'var(--text-secondary)',
  fontWeight: 700
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px dashed var(--border-color)',
  paddingTop: '10px',
  marginTop: '4px',
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const totalPriceStyle = {
  color: 'var(--color-primary)',
  fontSize: '1.05rem'
};
