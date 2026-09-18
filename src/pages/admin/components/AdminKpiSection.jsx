/**
 * Section KPIs & Statistiques Administrateur (AdminKpiSection).
 * Priorise la répartition opérationnelle des commandes avec volet repliable pour les revenus.
 */

import React from 'react';
import { Hourglass, ChefHat, Bike, CheckCircle2, XCircle } from 'lucide-react';
import { RevenueKpisCollapse } from './RevenueKpisCollapse';

export const AdminKpiSection = ({ dashboardData, onSelectOrder }) => {
  const kpi = dashboardData?.kpi || {};
  const recentOrders = dashboardData?.recentOrders || [];
  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  const statusCards = [
    { label: 'En attente', count: kpi.pendingCount || 0, color: 'var(--color-secondary)', bg: 'rgba(217, 119, 6, 0.10)', border: 'rgba(217, 119, 6, 0.25)', icon: Hourglass },
    { label: 'En cuisine', count: kpi.preparingCount || 0, color: 'var(--color-primary)', bg: 'rgba(230, 81, 0, 0.10)', border: 'rgba(230, 81, 0, 0.25)', icon: ChefHat },
    { label: 'En livraison', count: kpi.inDeliveryCount || 0, color: 'var(--color-accent)', bg: 'rgba(2, 132, 199, 0.10)', border: 'rgba(2, 132, 199, 0.25)', icon: Bike },
    { label: 'Livrées', count: kpi.deliveredCount || 0, color: 'var(--status-success)', bg: 'rgba(22, 163, 74, 0.10)', border: 'rgba(22, 163, 74, 0.25)', icon: CheckCircle2 },
    { label: 'Annulées', count: kpi.cancelledCount || 0, color: 'var(--status-error)', bg: 'rgba(220, 38, 38, 0.10)', border: 'rgba(220, 38, 38, 0.25)', icon: XCircle }
  ];

  return (
    <div style={sectionContainerStyle}>
      {/* 1. Priorité N°1 : Répartition des statuts des commandes en cours */}
      <div className="card-surface" style={statusSectionCardStyle}>
        <h4 style={sectionTitleStyle}>Répartition des Commandes</h4>
        <div style={statusGridStyle}>
          {statusCards.map((card, idx) => {
            const Icon = card.icon;
            const isBottomRow = idx >= 3;
            return (
              <div
                key={card.label}
                style={{
                  ...statusMiniCardStyle,
                  backgroundColor: card.bg,
                  borderColor: card.border,
                  gridColumn: isBottomRow ? 'span 3' : 'span 2'
                }}
              >
                <div style={statusHeaderStyle}>
                  <Icon size={16} color={card.color} />
                  <span style={{ ...statusCardLabelStyle, color: card.color }}>{card.label}</span>
                </div>
                <strong style={{ ...statusCardCountStyle, color: card.color }}>{card.count}</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Volet repliable haute visibilité "Mes revenus" */}
      <RevenueKpisCollapse kpi={kpi} />

      {/* 3. Activité Récente (Dernières Commandes) */}
      <div className="card-surface" style={recentOrdersCardStyle}>
        <h4 style={sectionTitleStyle}>Activité Récente</h4>
        {recentOrders.length === 0 ? (
          <p style={emptyTextStyle}>Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div style={ordersListStyle}>
            {recentOrders.map((ord) => (
              <div
                key={ord._id}
                onClick={() => onSelectOrder(ord)}
                style={orderRowStyle}
              >
                <div>
                  <span style={orderNumberStyle}>{ord.orderNumber}</span>
                  <p style={customerNameStyle}>{ord.customer?.firstName} {ord.customer?.lastName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={orderPriceStyle}>{formatPrice(ord.total)}</strong>
                  <span style={orderBadgeStyle(ord.status)}>{ord.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const sectionContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const statusSectionCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const sectionTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const statusGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: '10px'
};

const statusMiniCardStyle = {
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '8px',
  transition: 'transform 0.15s ease'
};

const statusHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const statusCardLabelStyle = {
  fontSize: '0.74rem',
  fontWeight: 700
};

const statusCardCountStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  lineHeight: 1
};

const recentOrdersCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const emptyTextStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-muted)',
  textAlign: 'center',
  padding: '12px 0'
};

const ordersListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const orderRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease'
};

const orderNumberStyle = {
  fontSize: '0.84rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const customerNameStyle = {
  fontSize: '0.78rem',
  color: 'var(--text-secondary)'
};

const orderPriceStyle = {
  fontSize: '0.86rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  display: 'block'
};

const orderBadgeStyle = (status) => ({
  display: 'inline-block',
  fontSize: '0.68rem',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: '6px',
  backgroundColor: status === 'DELIVERED' ? 'var(--color-accent-surface)' : 'var(--color-primary-surface)',
  color: status === 'DELIVERED' ? 'var(--color-accent-dark)' : 'var(--color-primary-dark)'
});
