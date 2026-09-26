/**
 * Modale publicitaire pop-up automatique pour les promotions d'accueil (PromoPopupModal).
 * Apparaît à l'arrivée sur l'accueil avec bannière Cloudinary ou carte dégradée.
 */

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Tag, BadgePercent } from 'lucide-react';
import { Button } from './Button';

export const PromoPopupModal = ({
  promotions = [],
  onNavigate,
  onSelectDish
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);

  useEffect(() => {
    // Trouve la première promotion active
    const active = promotions.find((p) => p && p.isActive !== false);
    if (!active) {
      setIsOpen(false);
      return;
    }

    // Vérifie si la promo a déjà été fermée pendant la session actuelle
    const seenKey = `rb_seen_promo_${active._id || active.title}`;
    const hasSeen = sessionStorage.getItem(seenKey);

    if (!hasSeen) {
      setCurrentPromo(active);
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [promotions]);

  const handleClose = () => {
    if (currentPromo) {
      const seenKey = `rb_seen_promo_${currentPromo._id || currentPromo.title}`;
      sessionStorage.setItem(seenKey, 'true');
    }
    setIsOpen(false);
  };

  const handleActionClick = () => {
    if (!currentPromo) return;
    handleClose();

    // Redirection selon le type de cible configuré
    if (currentPromo.dishId) {
      const dish = typeof currentPromo.dishId === 'object' ? currentPromo.dishId : null;
      if (dish && onSelectDish) {
        onSelectDish(dish);
      } else if (onNavigate) {
        onNavigate('menu');
      }
    } else if (currentPromo.link) {
      const url = currentPromo.link.trim();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (onNavigate) {
        const cleanTab = url.replace(/^\//, '').toLowerCase();
        onNavigate(cleanTab || 'menu');
      }
    } else if (onNavigate) {
      onNavigate('menu');
    }
  };

  if (!isOpen || !currentPromo) return null;

  const hasImage = Boolean(currentPromo.image && currentPromo.image.trim());

  return (
    <div style={backdropStyle} onClick={handleClose}>
      <div
        className="animate-scale-in"
        style={modalCardStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton Fermer flottant */}
        <button
          type="button"
          onClick={handleClose}
          style={closeButtonStyle}
          title="Fermer la promotion"
          aria-label="Fermer la promotion"
        >
          <X size={18} color="var(--text-primary)" />
        </button>

        {/* Bannière de l'offre */}
        {hasImage ? (
          <div style={bannerWrapperStyle}>
            <img src={currentPromo.image} alt={currentPromo.title} style={bannerImgStyle} />
            <div style={bannerTagOverlayStyle}>
              <Tag size={13} color="#FFFFFF" />
              <span>Offre Spéciale</span>
            </div>
          </div>
        ) : (
          <div style={gradientHeaderStyle}>
            <div style={iconBadgeStyle}>
              <Tag size={26} color="var(--color-primary)" />
            </div>
            <span style={gradientTagStyle}>Offre Exclusive</span>
          </div>
        )}

        {/* Corps textuel */}
        <div style={contentPaddingStyle}>
          <h3 style={promoTitleStyle}>{currentPromo.title}</h3>
          {currentPromo.description && (
            <p style={promoDescStyle}>{currentPromo.description}</p>
          )}

          {/* Boutons d'action */}
          <div style={actionRowStyle}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={handleActionClick}
              style={{ width: '100%' }}
            >
              En profiter maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(11, 17, 32, 0.75)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 9999
};

const modalCardStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '420px',
  backgroundColor: 'var(--bg-elevated, #FFFFFF)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.90)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
};

const bannerWrapperStyle = {
  position: 'relative',
  width: '100%',
  maxHeight: '220px',
  backgroundColor: 'var(--bg-card-header)',
  overflow: 'hidden'
};

const bannerImgStyle = { width: '100%', height: '220px', objectFit: 'cover', display: 'block' };

const bannerTagOverlayStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  backgroundColor: 'var(--color-primary, #E65100)',
  color: '#FFFFFF',
  fontSize: '0.74rem',
  fontWeight: 800,
  padding: '4px 10px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  textTransform: 'uppercase'
};

const gradientHeaderStyle = {
  padding: '30px 20px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(135deg, var(--color-primary-surface) 0%, var(--color-secondary-surface) 100%)'
};

const iconBadgeStyle = {
  width: '54px',
  height: '54px',
  borderRadius: '50%',
  backgroundColor: 'var(--bg-elevated)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(230, 81, 0, 0.20)'
};

const gradientTagStyle = {
  fontSize: '0.8rem',
  fontWeight: 800,
  color: 'var(--color-primary-dark)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const contentPaddingStyle = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'center' };
const promoTitleStyle = { fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 };
const promoDescStyle = { fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 auto', maxWidth: '340px' };
const actionRowStyle = { marginTop: '10px', width: '100%' };
