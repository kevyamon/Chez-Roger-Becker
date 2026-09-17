/**
 * Page de suivi de commande en temps réel sans compte (/commande/suivi/:token).
 * Synchronisée en direct via Socket.IO avec timeline et coordonnées du livreur.
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Bike, Phone, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../services/api';
import { socket, joinOrderRoom } from '../../services/socket';
import { Button } from '../../components/ui/Button';

export const OrderTrackingPage = ({ trackingToken, onNavigate }) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    if (!trackingToken) {
      setError('Aucun numéro de suivi fourni.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get(`/orders/track/${trackingToken}`);
      if (res.success && res.data?.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      setError(err.message || 'Impossible de charger les données de suivi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    if (trackingToken) {
      joinOrderRoom(trackingToken);

      const handleStatusChange = (updatedData) => {
        setOrder((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: updatedData.status,
            statusHistory: updatedData.statusHistory || prev.statusHistory,
            driverId: updatedData.driver || prev.driverId
          };
        });
      };

      socket.on('order:status-changed', handleStatusChange);

      return () => {
        socket.off('order:status-changed', handleStatusChange);
      };
    }
  }, [trackingToken]);

  const steps = [
    { key: 'PENDING', label: 'Commande reçue', desc: 'En attente de confirmation' },
    { key: 'CONFIRMED', label: 'Commande confirmée', desc: 'Validée par le restaurant' },
    { key: 'PREPARING', label: 'Préparation en cours', desc: 'Nos cuisiniers préparent votre plat' },
    { key: 'READY_FOR_PICKUP', label: 'Prête à récupérer', desc: 'Prête pour le départ' },
    { key: 'OUT_FOR_DELIVERY', label: 'En cours de livraison', desc: 'Le livreur est en route' },
    { key: 'DELIVERED', label: 'Commande livrée', desc: 'Bon appétit !' }
  ];

  const getStepIndex = (status) => {
    if (['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(status)) return 4;
    if (status === 'DELIVERED') return 5;
    const idx = steps.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  if (isLoading) {
    return (
      <div style={centerContainerStyle}>
        <RefreshCw size={36} color="var(--color-primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Chargement de votre commande...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={centerContainerStyle}>
        <AlertCircle size={44} color="#DC2626" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Commande introuvable</h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{error}</p>
        <Button variant="primary" size="md" onClick={() => onNavigate('home')} style={{ marginTop: '12px' }}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* 1. EN-TÊTE DE COMMANDE */}
      <div className="card-surface" style={summaryHeaderStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={orderLabelStyle}>Numéro de commande</span>
            <h3 style={orderNumberStyle}>{order.orderNumber}</h3>
          </div>
          <button onClick={fetchOrder} style={refreshBtnStyle} title="Actualiser">
            <RefreshCw size={16} />
          </button>
        </div>
        <div style={badgeContainerStyle}>
          <span style={statusBadgeStyle}>{order.status}</span>
          <span style={totalBadgeStyle}>{order.total?.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      {/* 2. TIMELINE DES ÉTAPES */}
      <div className="card-surface" style={timelineCardStyle}>
        <h4 style={timelineHeadingStyle}>Progression de la commande</h4>
        <div style={timelineStyle}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} style={timelineItemStyle}>
                <div style={iconColStyle}>
                  <div
                    style={{
                      ...stepCircleStyle,
                      backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--border-color)',
                      color: isCompleted ? '#FFFFFF' : 'var(--text-muted)'
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : <Clock size={14} />}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      style={{
                        ...stepLineStyle,
                        backgroundColor: idx < currentStepIdx ? 'var(--color-primary)' : 'var(--border-color)'
                      }}
                    />
                  )}
                </div>
                <div style={stepTextStyle}>
                  <p style={{ ...stepTitleStyle, color: isCurrent ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                    {step.label}
                  </p>
                  <p style={stepDescStyle}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. LIVREUR ASSIGNÉ */}
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
            <a href={`tel:${order.driverId.phone}`} style={callDriverBtnStyle}>
              <Phone size={16} /> Appeler
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  paddingBottom: '30px'
};

const centerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 20px',
  gap: '12px'
};

const summaryHeaderStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const orderLabelStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-muted)',
  fontWeight: 700,
  textTransform: 'uppercase'
};

const orderNumberStyle = {
  fontSize: '1.3rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const refreshBtnStyle = {
  padding: '6px',
  color: 'var(--text-muted)',
  borderRadius: '8px'
};

const badgeContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '6px',
  borderTop: '1px solid var(--border-color)'
};

const statusBadgeStyle = {
  backgroundColor: 'var(--color-primary-surface)',
  color: 'var(--color-primary-dark)',
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: 800
};

const totalBadgeStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const timelineCardStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const timelineHeadingStyle = {
  fontSize: '0.98rem',
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

const stepTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '16px'
};

const stepTitleStyle = {
  fontSize: '0.88rem',
  fontWeight: 700
};

const stepDescStyle = {
  fontSize: '0.76rem',
  color: 'var(--text-secondary)'
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

const callDriverBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'var(--color-accent)',
  color: '#FFFFFF',
  padding: '8px 14px',
  borderRadius: '10px',
  fontSize: '0.82rem',
  fontWeight: 700,
  textDecoration: 'none',
  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
};
