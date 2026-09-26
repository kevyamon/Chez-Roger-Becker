/**
 * Barre de navigation inférieure (TabBar) Flottante Style iOS 26.
 * Navigation fluide, scroll to top intelligent et accès secret administrateur 100% invisible.
 */

import React, { useRef, useEffect } from 'react';
import { Home, UtensilsCrossed, ShoppingBag, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const TabBar = ({ activeTab, onSelectTab }) => {
  const { totalCount } = useCart();

  const holdTimerRef = useRef(null);
  const isSecretTriggeredRef = useRef(false);
  const HOLD_DURATION_MS = 5000; // 5 secondes de maintien invisible

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'cart', label: 'Panier', icon: ShoppingBag, badge: totalCount },
    { id: 'track', label: 'Commandes', icon: Compass }
  ];

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const validIndex = activeIndex !== -1 ? activeIndex : 0;
  const isTabActive = activeIndex !== -1;

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearHoldTimer();
  }, []);

  // Début du maintien secret sur l'icône Accueil (100% silencieux et invisible)
  const handleHomePointerDown = () => {
    clearHoldTimer();
    if (isSecretTriggeredRef.current) return;

    holdTimerRef.current = setTimeout(() => {
      isSecretTriggeredRef.current = true;
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      onSelectTab('auth-admin');
      clearHoldTimer();

      setTimeout(() => {
        isSecretTriggeredRef.current = false;
      }, 800);
    }, HOLD_DURATION_MS);
  };

  // Annulation immédiate dès relâchement ou déplacement
  const handleHomePointerUp = () => {
    clearHoldTimer();
  };

  const handleTabClick = (tabId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSecretTriggeredRef.current) return;

    // Si l'utilisateur clique sur Accueil alors qu'il y est déjà : remonter en haut (Scroll to top)
    if (tabId === 'home' && activeTab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSelectTab(tabId);
  };

  return (
    <nav className="mobile-tabbar" aria-label="Navigation principale">
      {/* Bulle fluide glissante (iOS 26 Liquid Indicator) */}
      {isTabActive && (
        <div
          className="tabbar-indicator"
          style={{
            width: `calc((100% - 12px) / ${tabs.length})`,
            left: `calc(6px + ${validIndex} * ((100% - 12px) / ${tabs.length}))`
          }}
        />
      )}

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isHome = tab.id === 'home';

        return (
          <button
            key={tab.id}
            onClick={(e) => handleTabClick(tab.id, e)}
            onPointerDown={isHome ? handleHomePointerDown : undefined}
            onPointerUp={isHome ? handleHomePointerUp : undefined}
            onPointerLeave={isHome ? handleHomePointerUp : undefined}
            onPointerCancel={isHome ? handleHomePointerUp : undefined}
            onContextMenu={isHome ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
            className={`tab-item ${isActive ? 'active' : ''}`}
            style={{
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            <div style={iconContainerStyle}>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ zIndex: 2 }}
              />

              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="badge-count">{tab.badge > 99 ? '99+' : tab.badge}</span>
              )}
            </div>
            <span style={tabLabelStyle}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const iconContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '34px',
  height: '34px'
};

const tabLabelStyle = {
  fontSize: '0.68rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  textAlign: 'center'
};
