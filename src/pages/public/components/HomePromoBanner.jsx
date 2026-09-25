/**
 * Bannière promotionnelle intégrée à la page d'accueil (HomePromoBanner).
 */

import React from 'react';
import { Button } from '../../../components/ui/Button';

export const HomePromoBanner = ({ promo, onAction }) => {
  if (!promo) return null;

  return (
    <section style={promoSectionStyle}>
      <div className="card-surface" style={promoCardStyle}>
        {promo.image && (
          <img
            src={promo.image}
            alt={promo.title}
            style={promoBannerImageStyle}
          />
        )}
        <div style={promoHeaderStyle}>
          <span style={promoTagStyle}>Offre Exclusive</span>
          <h3 style={promoTitleStyle}>{promo.title}</h3>
          {promo.description && <p style={promoDescStyle}>{promo.description}</p>}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onAction(promo)}
            style={{ marginTop: '10px' }}
          >
            En profiter
          </Button>
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
  border: '1.5px solid var(--color-secondary-light)'
};

const promoBannerImageStyle = {
  width: '100%',
  height: '140px',
  objectFit: 'cover',
  borderRadius: '10px',
  marginBottom: '10px'
};

const promoHeaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const promoTagStyle = {
  fontSize: '0.72rem',
  fontWeight: 800,
  color: 'var(--color-primary-dark)',
  textTransform: 'uppercase'
};

const promoTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const promoDescStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)'
};
