/**
 * Section KPIs & Statistiques Administrateur (AdminKpiSection).
 * Affiche la synthese financiere et operationnelle en temps reel.
 */

import React from 'react';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export const AdminKpiSection = ({ dashboardData, onSelectOrder }) => {
  const kpi = dashboardData?.kpi || {};
  const recentOrders = dashboardData?.recentOrders || [];

  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div style={sectionContainerStyle}>
      {/* 1. Cartes de Revenus & Volume */}
      <div style={gridKpiStyle}>
        <div className="card-surface" style={kpiCardStyle}>
          <div style={kpiIconWrapStyle('var(--color-primary-surface)', 'var(--color-primary)')}>
            <DollarSign size={20} />
          </div>
          <div>
            <span style={kpiLabelStyle}>Revenus du Jour</span>
            <h3 style={kpiValueStyle}>{formatPrice(kpi.revenueToday)}</h3>
          </div>
        </div>

        <div className="card-surface" style={kpiCardStyle}>
          <div style={kpiIconWrapStyle('var(--color-secondary-surface)', 'var(--color-secondary)')}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={kpiLabelStyle}>Revenus Semaine</span>
            <h3 style={kpiValueStyle}>{formatPrice(kpi.revenueWeek)}</h3>
          </div>
        </div>

        <div className="card-surface" style={kpiCardStyle}>
          <div style={kpiIconWrapStyle('var(--color-accent-surface)', 'var(--color-accent)')}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <span style={kpiLabelStyle}>Commandes du Jour</span>
            <h3 style={kpiValueStyle}>{kpi.ordersToday || 0}</h3>
          </div>
        </div>

        <div className="card-surface" style={kpiCardStyle}>
          <div style={kpiIconWrapStyle('var(--bg-card-header)', 'var(--text-primary)')}>
            <Clock size={20} />
          </div>
          <div>
            <span style={kpiLabelStyle}>En Préparation / Livraison</span>
            <h3 style={kpiValueStyle}>{(kpi.preparingCount || 0) + (kpi.inDeliveryCount || 0)}</h3>
          </div>
        </div>
      </div>

      {/* 2. Repartition des statuts */}
      <div className="card-surface" style={statusBreakdownCardStyle}>
        <h4 style={sectionTitleStyle}>Répartition des Commandes</h4>
        <div style={statusGridStyle}>
          <div style={statusItemStyle}>
            <span style={statusDotStyle('var(--status-warning)')} />
            <span style={statusLabelStyle}>En attente :</span>
            <strong style={statusCountStyle}>{kpi.pendingCount || 0}</strong>
          </div>
          <div style={statusItemStyle}>
            <span style={statusDotStyle('var(--color-primary)')} />
            <span style={statusLabelStyle}>En cuisine :</span>
            <strong style={statusCountStyle}>{kpi.preparingCount || 0}</strong>
          </div>
          <div style={statusItemStyle}>
            <span style={statusDotStyle('var(--color-accent)')} />
            <span style={statusLabelStyle}>En livraison :</span>
            <strong style={statusCountStyle}>{kpi.inDeliveryCount || 0}</strong>
          </div>
          <div style={statusItemStyle}>
            <span style={statusDotStyle('var(--status-success)')} />
            <span style={statusLabelStyle}>Livrées :</span>
            <strong style={statusCountStyle}>{kpi.deliveredCount || 0}</strong>
          </div>
          <div style={statusItemStyle}>
            <span style={statusDotStyle('var(--status-error)')} />
            <span style={statusLabelStyle}>Annulées :</span>
            <strong style={statusCountStyle}>{kpi.cancelledCount || 0}</strong>
          </div>
        </div>
      </div>

      {/* 3. Dernieres Commandes Recues */}
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

const gridKpiStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '10px'
};

const kpiCardStyle = {
  padding: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const kpiIconWrapStyle = (bg, color) => ({
  width: '42px',
  height: '42px',
  borderRadius: '12px',
  backgroundColor: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

const kpiLabelStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  display: 'block'
};

const kpiValueStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  marginTop: '2px'
};

const statusBreakdownCardStyle = {
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: '10px'
};

const statusItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.82rem'
};

const statusDotStyle = (color) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0
});

const statusLabelStyle = {
  color: 'var(--text-secondary)'
};

const statusCountStyle = {
  color: 'var(--text-primary)',
  marginLeft: 'auto'
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
