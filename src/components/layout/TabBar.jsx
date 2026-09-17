/**
 * Barre de navigation inferieure (TabBar) Flottante Style iOS 26.
 * Inclut l'indicateur actif fluide comme de l'eau et le detecteur secret d'administration (10s).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Home, UtensilsCrossed, ShoppingBag, Compass } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const TabBar = ({ activeTab, onSelectTab }) => {
  const { totalCount } = useCart();

  // Progression de la jauge (0 a 100%) et etat d'appui actif
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);

  // References de detection haute precision
  const lastTapTimestampRef = useRef(0);
  const activePointerIdRef = useRef(null);
  const animationFrameRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const isSecretTriggeredRef = useRef(false);
  const HOLD_DURATION_MS = 10000; // 10 secondes

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'cart', label: 'Panier', icon: ShoppingBag, badge: totalCount },
    { id: 'track', label: 'Mes commandes', icon: Compass }
  ];

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const validIndex = activeIndex !== -1 ? activeIndex : 0;
  const isTabActive = activeIndex !== -1;

  const cancelAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const resetAll = () => {
    cancelAnimation();
    holdStartTimeRef.current = null;
    setIsPressing(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      cancelAnimation();
    };
  }, []);

  // Animation en boucle fluide de la jauge
  const animateProgress = () => {
    if (!holdStartTimeRef.current) return;
    const elapsed = Date.now() - holdStartTimeRef.current;
    const currentProgress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
    setProgress(currentProgress);

    if (elapsed >= HOLD_DURATION_MS) {
      // 10 secondes atteintes : declenchement certain
      isSecretTriggeredRef.current = true;
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      onSelectTab('auth');
      resetAll();
      lastTapTimestampRef.current = 0;

      setTimeout(() => {
        isSecretTriggeredRef.current = false;
      }, 800);
    } else {
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    }
  };

  // Demarrage de l'appui sur Accueil
  const handleHomePointerDown = (e) => {
    if (isSecretTriggeredRef.current) return;

    try {
      if (e.target && e.target.setPointerCapture && e.pointerId) {
        e.target.setPointerCapture(e.pointerId);
        activePointerIdRef.current = e.pointerId;
      }
    } catch {}

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimestampRef.current;

    // Double-tap : intervalle entre 50ms et 800ms
    if (timeSinceLastTap >= 50 && timeSinceLastTap <= 800) {
      lastTapTimestampRef.current = 0;
      setIsPressing(true);
      holdStartTimeRef.current = Date.now();
      cancelAnimation();
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    } else {
      lastTapTimestampRef.current = now;
      resetAll();
    }
  };

  // Relachement ou annulation
  const handleHomePointerUp = (e) => {
    if (activePointerIdRef.current !== null && e?.target?.releasePointerCapture) {
      try {
        e.target.releasePointerCapture(activePointerIdRef.current);
      } catch {}
      activePointerIdRef.current = null;
    }
    resetAll();
  };

  const handleTabClick = (tabId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSecretTriggeredRef.current) return;
    onSelectTab(tabId);
  };

  // Calcul du cercle SVG (rayon r=18)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
              {/* Jauge circulaire SVG visible uniquement lors du maintien sur Accueil */}
              {isHome && isPressing && (
                <svg
                  width="44"
                  height="44"
                  style={svgProgressStyle}
                  viewBox="0 0 44 44"
                >
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke="var(--bg-card-header, rgba(255, 255, 255, 0.15))"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                  />
                </svg>
              )}

              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  transform: isHome && isPressing ? 'scale(0.92)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                  zIndex: 2
                }}
              />

              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="badge-count">{tab.badge > 99 ? '99+' : tab.badge}</span>
              )}
            </div>
            <span>{tab.label}</span>
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

const svgProgressStyle = {
  position: 'absolute',
  top: '-5px',
  left: '-5px',
  transform: 'rotate(-90deg)',
  pointerEvents: 'none',
  zIndex: 1
};
