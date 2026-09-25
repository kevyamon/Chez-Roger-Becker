/**
 * Composant de chargement squelette réutilisable (Skeleton).
 * Affiche des formes animées pour préserver la structure visuelle durant le chargement des données.
 */

import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  variant = 'rectangular',
  style = {},
  className = ''
}) => {
  const getRadius = () => {
    if (variant === 'circular') return '50%';
    if (variant === 'text') return '4px';
    return borderRadius;
  };

  const computedStyle = {
    width,
    height,
    borderRadius: getRadius(),
    display: 'inline-block',
    ...style
  };

  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={computedStyle}
      aria-hidden="true"
    />
  );
};
