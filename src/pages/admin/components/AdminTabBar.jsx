/**
 * Barre de navigation flottante de l'administrateur (AdminTabBar).
 * Style iOS 26 identique à la TabBar publique avec défilement horizontal et flèche interactive.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Bike,
  Sliders,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const AdminTabBar = ({ activeSection, onSelectSection, pendingOrdersCount = 0 }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const sections = [
    { id: 'kpis', label: 'Indicateurs', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'menu', label: 'Menu & Plats', icon: UtensilsCrossed },
    { id: 'promos', label: 'Offres', icon: Tag },
    { id: 'drivers', label: 'Livreurs', icon: Bike },
    { id: 'settings', label: 'Paramètres', icon: Sliders }
  ];

  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      window.addEventListener('resize', updateScrollState);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const handleArrowClick = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 20) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollContainerRef.current.scrollBy({ left: 140, behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobile-tabbar admin-tabbar" aria-label="Navigation Administrateur" style={adminTabBarStyle}>
      <div
        ref={scrollContainerRef}
        style={scrollContainerStyle}
        className="hide-scrollbar"
      >
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              style={isActive ? activeItemStyle : inactiveItemStyle}
            >
              <div style={iconWrapperStyle}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                {Boolean(sec.badge && sec.badge > 0) && (
                  <span className="badge-count" style={badgeStyle}>
                    {sec.badge > 99 ? '99+' : sec.badge}
                  </span>
                )}
              </div>
              <span style={labelStyle}>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Flèche d'indication et de défilement pas à pas */}
      <button
        type="button"
        onClick={handleArrowClick}
        style={scrollArrowButtonStyle}
        title={canScrollRight ? 'Faire défiler vers la droite' : 'Revenir au début'}
        aria-label="Faire défiler les onglets"
      >
        {canScrollRight ? (
          <ChevronRight size={18} color="var(--color-primary)" />
        ) : (
          <ChevronLeft size={18} color="var(--color-primary)" />
        )}
      </button>
    </nav>
  );
};

const adminTabBarStyle = {
  position: 'fixed',
  bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 24px)',
  maxWidth: '520px',
  background: 'var(--tabbar-bg)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid var(--tabbar-border)',
  borderRadius: '9999px',
  display: 'flex',
  alignItems: 'center',
  padding: '5px 8px',
  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.04)',
  zIndex: 90
};

const scrollContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  flex: 1,
  paddingRight: '6px'
};

const baseItemStyle = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 12px',
  borderRadius: '9999px',
  fontSize: '0.74rem',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  border: '1px solid transparent',
  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
  flexShrink: 0
};

const activeItemStyle = {
  ...baseItemStyle,
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  borderColor: 'var(--color-primary-dark)',
  boxShadow: '0 2px 10px rgba(230, 81, 0, 0.30)'
};

const inactiveItemStyle = {
  ...baseItemStyle,
  backgroundColor: 'transparent',
  color: 'var(--text-muted)'
};

const iconWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const labelStyle = {
  lineHeight: 1
};

const badgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-10px',
  fontSize: '0.62rem',
  height: '16px',
  minWidth: '16px',
  padding: '0 3px'
};

const scrollArrowButtonStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.15s ease'
};
