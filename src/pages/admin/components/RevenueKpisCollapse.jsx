/**
 * Composant repliable pour les statistiques de revenus (RevenueKpisCollapse).
 * Masqué par défaut pour prioriser le flux des commandes opérationnelles.
 */

import React, { useState } from 'react';
import { DollarSign, TrendingUp, ShoppingBag, Clock, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';

export const RevenueKpisCollapse = ({ kpi = {}, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div style={wrapperStyle}>
      {/* Bouton déclencheur haute visibilité */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="card-surface"
        style={triggerButtonStyle}
        aria-expanded={isOpen}
      >
        <div style={triggerLeftStyle}>
          <div style={iconBadgeStyle}>
            <DollarSign size={18} color="var(--color-primary)" />
          </div>
          <div style={textBlockStyle}>
            <span style={titleStyle}>Mes revenus</span>
            <span style={subtitleStyle}>
              {isOpen ? 'Masquer les indicateurs financiers' : 'Consulter les revenus et volumes'}
            </span>
          </div>
        </div>

        <div style={triggerRightStyle}>
          {isOpen ? (
            <div style={actionPillStyle}>
              <EyeOff size={14} color="var(--text-secondary)" />
              <ChevronUp size={16} color="var(--text-secondary)" />
            </div>
          ) : (
            <div style={actionPillStyle}>
              <Eye size={14} color="var(--color-primary)" />
              <ChevronDown size={16} color="var(--color-primary)" />
            </div>
          )}
        </div>
      </button>

      {/* Grille 2x2 des indicateurs financiers (dépliée à la demande) */}
      {isOpen && (
        <div className="animate-fade-in" style={grid2x2Style}>
          <div className="card-surface" style={kpiCardStyle}>
            <div style={kpiIconWrapStyle('var(--color-primary-surface)', 'var(--color-primary)')}>
              <DollarSign size={20} />
            </div>
            <div style={kpiContentStyle}>
              <span style={kpiLabelStyle}>Revenus du Jour</span>
              {isLoading ? (
                <Skeleton width="90px" height="18px" />
              ) : (
                <h3 style={kpiValueStyle}>{formatPrice(kpi.revenueToday)}</h3>
              )}
            </div>
          </div>

          <div className="card-surface" style={kpiCardStyle}>
            <div style={kpiIconWrapStyle('var(--color-secondary-surface)', 'var(--color-secondary)')}>
              <TrendingUp size={20} />
            </div>
            <div style={kpiContentStyle}>
              <span style={kpiLabelStyle}>Revenus Semaine</span>
              {isLoading ? (
                <Skeleton width="90px" height="18px" />
              ) : (
                <h3 style={kpiValueStyle}>{formatPrice(kpi.revenueWeek)}</h3>
              )}
            </div>
          </div>

          <div className="card-surface" style={kpiCardStyle}>
            <div style={kpiIconWrapStyle('var(--color-accent-surface)', 'var(--color-accent)')}>
              <ShoppingBag size={20} />
            </div>
            <div style={kpiContentStyle}>
              <span style={kpiLabelStyle}>Commandes du Jour</span>
              {isLoading ? (
                <Skeleton width="45px" height="18px" />
              ) : (
                <h3 style={kpiValueStyle}>{kpi.ordersToday || 0}</h3>
              )}
            </div>
          </div>

          <div className="card-surface" style={kpiCardStyle}>
            <div style={kpiIconWrapStyle('var(--bg-card-header)', 'var(--text-primary)')}>
              <Clock size={20} />
            </div>
            <div style={kpiContentStyle}>
              <span style={kpiLabelStyle}>En Cours</span>
              {isLoading ? (
                <Skeleton width="45px" height="18px" />
              ) : (
                <h3 style={kpiValueStyle}>{(kpi.preparingCount || 0) + (kpi.inDeliveryCount || 0)}</h3>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const triggerButtonStyle = {
  width: '100%',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  textAlign: 'left'
};

const triggerLeftStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const iconBadgeStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const textBlockStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1px'
};

const titleStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const subtitleStyle = {
  fontSize: '0.72rem',
  fontWeight: 500,
  color: 'var(--text-secondary)'
};

const triggerRightStyle = {
  display: 'flex',
  alignItems: 'center'
};

const actionPillStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  borderRadius: '9999px',
  backgroundColor: 'var(--bg-card-header)'
};

const grid2x2Style = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '10px'
};

const kpiCardStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const kpiContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const kpiIconWrapStyle = (bg, color) => ({
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  backgroundColor: bg,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const kpiLabelStyle = {
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'var(--text-secondary)'
};

const kpiValueStyle = {
  fontSize: '0.98rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.2
};
