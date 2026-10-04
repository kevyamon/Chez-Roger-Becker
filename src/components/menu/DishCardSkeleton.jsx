/**
 * Squelette de chargement pour la carte de plat (DishCardSkeleton).
 * Préserve la disposition spatiale et la géométrie de DishCard pendant la mise en route du backend.
 */

import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const DishCardSkeleton = () => {
  return (
    <div className="card-surface" style={cardContainerStyle} aria-hidden="true">
      {/* Zone Image simulée */}
      <div style={imageContainerStyle}>
        <Skeleton width="100%" height="100%" borderRadius="0px" />
        <div style={topBadgesRowStyle}>
          <Skeleton width="64px" height="22px" borderRadius="6px" />
          <Skeleton width="52px" height="22px" borderRadius="6px" />
        </div>
      </div>

      {/* Zone Contenu simulée */}
      <div style={contentStyle}>
        <Skeleton width="65%" height="20px" borderRadius="6px" style={{ marginBottom: '8px' }} />
        <Skeleton width="92%" height="14px" borderRadius="4px" style={{ marginBottom: '6px' }} />
        <Skeleton width="48%" height="14px" borderRadius="4px" style={{ marginBottom: '14px' }} />

        {/* Pied de carte avec prix et bouton */}
        <div style={footerStyle}>
          <div style={priceWrapperStyle}>
            <Skeleton width="85px" height="22px" borderRadius="6px" />
          </div>
          <Skeleton width="36px" height="36px" borderRadius="12px" />
        </div>
      </div>
    </div>
  );
};

const cardContainerStyle = {
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px',
  pointerEvents: 'none',
  userSelect: 'none'
};

const imageContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '180px',
  backgroundColor: 'var(--border-color)',
  overflow: 'hidden'
};

const topBadgesRowStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  right: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const contentStyle = {
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto'
};

const priceWrapperStyle = {
  display: 'flex',
  flexDirection: 'column'
};
