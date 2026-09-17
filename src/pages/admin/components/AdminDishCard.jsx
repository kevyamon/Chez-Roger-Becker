/**
 * Composant de carte de plat pour le tableau de bord administrateur (AdminDishCard).
 * Présente le visuel, le nom, le prix, la description, les badges Type/Catégorie et les actions.
 */

import React from 'react';
import { Edit2, Trash2, CheckCircle2, XCircle, Utensils, GlassWater } from 'lucide-react';

export const AdminDishCard = ({
  dish,
  onToggleAvailability,
  onOpenEditDish,
  onDeleteDish,
  formatPrice
}) => {
  const dishType = dish.type || 'Nourriture';
  const dishCategory = dish.category || dish.categoryId?.name || 'Normal';

  const getCategoryBadgeStyle = () => {
    switch (dishCategory) {
      case 'VIP':
        return vipBadgeStyle;
      case 'Spécial':
        return specialBadgeStyle;
      default:
        return normalBadgeStyle;
    }
  };

  return (
    <div className="card-surface" style={dishCardStyle}>
      <div style={dishImageWrapStyle}>
        <img
          src={dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
          alt={dish.name}
          style={dishImageStyle}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
          }}
        />
      </div>

      <div style={dishInfoStyle}>
        <div style={dishTitleRowStyle}>
          <h4 style={dishNameStyle}>{dish.name}</h4>
          <strong style={dishPriceStyle}>{formatPrice(dish.price)}</strong>
        </div>

        {/* Badges Type & Catégorie */}
        <div style={badgesRowStyle}>
          <span style={typeBadgeStyle}>
            {dishType === 'Boisson' ? <GlassWater size={10} /> : <Utensils size={10} />}
            {dishType}
          </span>
          <span style={getCategoryBadgeStyle()}>{dishCategory}</span>
        </div>

        <p style={dishDescStyle}>{dish.description}</p>

        <div style={dishFooterStyle}>
          <button
            type="button"
            onClick={() => onToggleAvailability(dish._id, !dish.isAvailable)}
            style={dish.isAvailable ? availableBadgeStyle : unavailableBadgeStyle}
          >
            {dish.isAvailable ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            <span>{dish.isAvailable ? 'Disponible' : 'Épuisé'}</span>
          </button>

          <div style={dishActionsStyle}>
            <button
              type="button"
              onClick={() => onOpenEditDish(dish)}
              style={iconBtnStyle}
              title="Modifier le plat"
            >
              <Edit2 size={14} color="var(--color-primary)" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteDish(dish._id)}
              style={iconBtnStyle}
              title="Supprimer le plat"
            >
              <Trash2 size={14} color="var(--status-error)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const dishCardStyle = {
  padding: '12px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center'
};

const dishImageWrapStyle = {
  width: '78px',
  height: '78px',
  borderRadius: '10px',
  overflow: 'hidden',
  flexShrink: 0
};

const dishImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const dishInfoStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const dishTitleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const dishNameStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const dishPriceStyle = {
  fontSize: '0.86rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const badgesRowStyle = {
  display: 'flex',
  gap: '6px',
  alignItems: 'center'
};

const basePillStyle = {
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '0.66rem',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px'
};

const typeBadgeStyle = {
  ...basePillStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-color)'
};

const vipBadgeStyle = {
  ...basePillStyle,
  backgroundColor: 'var(--color-secondary-surface)',
  color: 'var(--color-secondary-dark)',
  border: '1px solid var(--color-secondary)'
};

const specialBadgeStyle = {
  ...basePillStyle,
  backgroundColor: 'var(--color-primary-surface)',
  color: 'var(--color-primary-dark)',
  border: '1px solid var(--color-primary)'
};

const normalBadgeStyle = {
  ...basePillStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-secondary)'
};

const dishDescStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.3,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const dishFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '4px'
};

const badgeBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer'
};

const availableBadgeStyle = {
  ...badgeBaseStyle,
  backgroundColor: 'var(--color-accent-surface)',
  color: 'var(--color-accent-dark)'
};

const unavailableBadgeStyle = {
  ...badgeBaseStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-muted)'
};

const dishActionsStyle = {
  display: 'flex',
  gap: '6px'
};

const iconBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card-header)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};
