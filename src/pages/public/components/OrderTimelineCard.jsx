/**
 * Carte de timeline de progression d'une commande (OrderTimelineCard).
 */

import React from 'react';
import { CheckCircle2, Clock, PauseCircle } from 'lucide-react';

const STEPS = [
  { key: 'PENDING', label: 'Commande reçue', desc: 'En attente de confirmation' },
  { key: 'CONFIRMED', label: 'Commande confirmée', desc: 'Validée par le restaurant' },
  { key: 'PREPARING', label: 'Préparation en cours', desc: 'Nos cuisiniers préparent votre plat' },
  { key: 'READY_FOR_PICKUP', label: 'Prête pour livraison', desc: 'Prête pour le départ' },
  { key: 'OUT_FOR_DELIVERY', label: 'En cours de livraison', desc: 'Le livreur est en route' },
  { key: 'DELIVERED', label: 'Commande livrée', desc: 'Bon appétit !' }
];

export const OrderTimelineCard = ({ currentStatus, isRestaurantClosed = false }) => {
  const getStepIndex = (status) => {
    if (['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(status)) return 4;
    if (status === 'DELIVERED') return 5;
    const idx = STEPS.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIdx = getStepIndex(currentStatus);

  return (
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
                    backgroundColor: isCompleted
                      ? isCurrent && isRestaurantClosed
                        ? 'var(--status-warning, #D97706)'
                        : 'var(--color-primary)'
                      : 'var(--border-color)',
                    color: isCompleted ? 'var(--color-primary-contrast, #FFFFFF)' : 'var(--text-muted)'
                  }}
                >
                  {isCompleted ? (
                    isCurrent && isRestaurantClosed ? (
                      <PauseCircle size={15} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )
                  ) : (
                    <Clock size={14} />
                  )}
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
                <p
                  style={{
                    ...stepHeadingStyle,
                    color: isCurrent
                      ? isRestaurantClosed
                        ? 'var(--status-warning, #D97706)'
                        : 'var(--color-primary)'
                      : 'var(--text-primary)'
                  }}
                >
                  {step.label}
                  {isCurrent && isRestaurantClosed && ' (En pause)'}
                </p>
                <p style={stepDescStyle}>
                  {isCurrent && isRestaurantClosed
                    ? 'Restaurant temporairement fermé. Reprise automatique dès l\'ouverture.'
                    : step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
