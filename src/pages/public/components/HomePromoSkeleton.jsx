/**
 * Squelette de chargement pour la bannière promotionnelle d'accueil (HomePromoSkeleton).
 */

import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';

export const HomePromoSkeleton = () => {
  return (
    <section style={promoSectionStyle} aria-hidden="true">
      <div className="card-surface" style={promoCardStyle}>
        <div style={promoHeaderStyle}>
          <Skeleton width="90px" height="14px" borderRadius="4px" style={{ marginBottom: '6px' }} />
          <Skeleton width="70%" height="22px" borderRadius="6px" style={{ marginBottom: '8px' }} />
          <Skeleton width="95%" height="14px" borderRadius="4px" style={{ marginBottom: '4px' }} />
          <Skeleton width="60%" height="14px" borderRadius="4px" style={{ marginBottom: '12px' }} />
          <Skeleton width="110px" height="34px" borderRadius="10px" />
        </div>
      </div>
    </section>
  );
};

const promoSectionStyle = {
  padding: '0 16px'
};

const promoCardStyle = {
  padding: '18px',
  background: 'linear-gradient(135deg, var(--color-primary-surface) 0%, var(--color-secondary-surface) 100%)',
  border: '1.5px solid var(--border-color)'
};

const promoHeaderStyle = {
  display: 'flex',
  flexDirection: 'column'
};
