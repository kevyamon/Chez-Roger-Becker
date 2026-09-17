/**
 * Barre d'onglets de navigation du Dashboard Administrateur (AdminNavTabs).
 * Navigation fluide et scrollable sur mobile entre les modules d'administration.
 */

import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Bike,
  Sliders,
  History
} from 'lucide-react';

export const AdminNavTabs = ({ activeSection, onSelectSection, pendingOrdersCount = 0 }) => {
  const sections = [
    { id: 'kpis', label: 'Indicateurs', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'menu', label: 'Menu & Plats', icon: UtensilsCrossed },
    { id: 'promos', label: 'Offres & Promos', icon: Tag },
    { id: 'drivers', label: 'Livreurs', icon: Bike },
    { id: 'settings', label: 'Paramètres', icon: Sliders },
    { id: 'audit', label: 'Audit Logs', icon: History }
  ];

  return (
    <div style={containerStyle}>
      <div style={scrollWrapperStyle}>
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              style={isActive ? activeTabStyle : inactiveTabStyle}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{sec.label}</span>
              {Boolean(sec.badge && sec.badge > 0) && (
                <span style={badgeStyle}>{sec.badge}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const containerStyle = {
  width: '100%',
  overflowX: 'auto',
  padding: '4px 0',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
};

const scrollWrapperStyle = {
  display: 'flex',
  gap: '8px',
  minWidth: 'max-content',
  padding: '2px 4px'
};

const baseTabStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  padding: '9px 14px',
  borderRadius: '12px',
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap'
};

const activeTabStyle = {
  ...baseTabStyle,
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  borderColor: 'var(--color-primary-dark)',
  boxShadow: 'var(--shadow-primary, 0 3px 10px rgba(230, 81, 0, 0.25))'
};

const inactiveTabStyle = {
  ...baseTabStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-secondary)',
  borderColor: 'var(--border-color)'
};

const badgeStyle = {
  backgroundColor: 'var(--status-error)',
  color: '#FFFFFF',
  fontSize: '0.68rem',
  fontWeight: 800,
  padding: '2px 6px',
  borderRadius: '10px'
};
