/**
 * Conteneur tactile Mobile-First avec geste de tirage vers le bas (Pull-to-Refresh).
 * Spécifiquement conçu pour offrir une expérience fluide sur iOS / Safari et PWA.
 */

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

export const PullToRefreshContainer = ({
  onRefresh,
  isRefreshing = false,
  children,
  pullThreshold = 65,
  maxPullDistance = 100
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleTouchStart = (e) => {
      // N'autoriser le pull-to-refresh que si la page est tout en haut du défilement
      if (window.scrollY <= 2) {
        touchStartY.current = e.touches[0].clientY;
        setIsPulling(true);
      } else {
        setIsPulling(false);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;

      if (diff > 0 && window.scrollY <= 2) {
        // Résistance élastique progressive
        const calculatedPull = Math.min(diff * 0.45, maxPullDistance);
        setPullDistance(calculatedPull);
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      setIsPulling(false);

      if (pullDistance >= pullThreshold && typeof onRefresh === 'function') {
        try {
          await onRefresh();
        } catch {
          // Échec silencieux géré par les toasts du parent
        }
      }
      setPullDistance(0);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, onRefresh, pullDistance, pullThreshold, maxPullDistance]);

  const rotationDeg = (pullDistance / pullThreshold) * 180;
  const isIndicatorVisible = pullDistance > 8 || isRefreshing;

  return (
    <div ref={containerRef} style={outerContainerStyle}>
      {/* Indicateur visuel de rafraîchissement au sommet */}
      <div
        style={{
          ...pullIndicatorStyle,
          height: isRefreshing ? '48px' : `${pullDistance}px`,
          opacity: isIndicatorVisible ? 1 : 0,
          transition: isPulling ? 'none' : 'height 0.3s ease, opacity 0.3s ease'
        }}
        aria-hidden="true"
      >
        <div style={iconBadgeStyle}>
          <RotateCw
            size={18}
            color="var(--color-primary)"
            className={isRefreshing ? 'animate-spin' : ''}
            style={{
              transform: isRefreshing ? 'none' : `rotate(${rotationDeg}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.1s ease'
            }}
          />
          <span style={indicatorTextStyle}>
            {isRefreshing
              ? 'Actualisation...'
              : pullDistance >= pullThreshold
              ? 'Relâchez pour actualiser'
              : 'Tirez vers le bas'}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};

const outerContainerStyle = {
  position: 'relative',
  width: '100%',
  minHeight: '100%'
};

const pullIndicatorStyle = {
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
};

const iconBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  backgroundColor: 'var(--bg-elevated)',
  borderRadius: '9999px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--card-shadow)'
};

const indicatorTextStyle = {
  fontSize: '0.74rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};
