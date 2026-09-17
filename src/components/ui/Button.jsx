/**
 * Composant Bouton interactif haut de gamme.
 * Respecte les trois couleurs maîtresses du projet (Orange, Ambre, Bleu).
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon = null,
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(230, 81, 0, 0.3)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary)',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)'
        };
      case 'accent':
        return {
          backgroundColor: 'var(--color-accent)',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '1.5px solid var(--color-primary)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 14px', fontSize: '0.82rem', borderRadius: '10px' };
      case 'lg':
        return { padding: '16px 24px', fontSize: '1.05rem', borderRadius: '16px' };
      default:
        return { padding: '12px 20px', fontSize: '0.94rem', borderRadius: '12px' };
    }
  };

  const combinedStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 700,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || isLoading ? 0.6 : 1,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      style={combinedStyles}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
      {!isLoading && Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
};
