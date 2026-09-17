/**
 * Carte de plat gastronomique (DishCard).
 * Met en valeur les photos, les prix promotionnels et le bouton d'ajout rapide au panier.
 */

import React from 'react';
import { Plus, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const DishCard = ({ dish, onSelect }) => {
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  const isPromo = dish.promotionalPrice && dish.promotionalPrice < dish.price;
  const displayPrice = isPromo ? dish.promotionalPrice : dish.price;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addItem(dish, 1);
    showSuccess(`${dish.name} a été ajouté à votre panier.`);
  };

  return (
    <div className="card-surface" style={cardContainerStyle} onClick={() => onSelect && onSelect(dish)}>
      <div style={imageContainerStyle}>
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          style={imageStyle}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {isPromo && (
          <div style={promoBadgeStyle}>
            <Tag size={12} />
            <span>Offre Spéciale</span>
          </div>
        )}
      </div>

      <div style={contentStyle}>
        <h4 style={titleStyle}>{dish.name}</h4>
        <p style={descStyle}>{dish.description}</p>

        <div style={footerStyle}>
          <div style={priceContainerStyle}>
            <span style={priceStyle}>{displayPrice?.toLocaleString('fr-FR')} FCFA</span>
            {isPromo && (
              <span style={oldPriceStyle}>{dish.price?.toLocaleString('fr-FR')} FCFA</span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            style={addButtonStyle}
            aria-label={`Ajouter ${dish.name} au panier`}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

const cardContainerStyle = {
  overflow: 'hidden',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '16px'
};

const imageContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '180px',
  backgroundColor: 'var(--border-color)',
  overflow: 'hidden'
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease'
};

const promoBadgeStyle = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  padding: '4px 10px',
  borderRadius: '8px',
  fontSize: '0.72rem',
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  boxShadow: '0 4px 10px rgba(230, 81, 0, 0.4)'
};

const contentStyle = {
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1
};

const titleStyle = {
  fontSize: '1.05rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '4px',
  lineHeight: 1.3
};

const descStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
  marginBottom: '12px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const footerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 'auto'
};

const priceContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const priceStyle = {
  fontSize: '1.08rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const oldPriceStyle = {
  fontSize: '0.78rem',
  color: 'var(--text-muted)',
  textDecoration: 'line-through'
};

const addButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(230, 81, 0, 0.35)'
};
