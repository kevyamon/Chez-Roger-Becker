/**
 * Modale de visualisation détaillée d'un plat avec sélecteur de quantité (DishDetailModal).
 */

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const DishDetailModal = ({
  dish,
  quantity,
  onClose,
  onChangeQuantity,
  onAddToCart
}) => {
  if (!dish) return null;

  const unitPrice = dish.promotionalPrice || dish.price;
  const totalPrice = unitPrice * quantity;

  return (
    <Modal isOpen={Boolean(dish)} onClose={onClose} title={dish.name}>
      <div style={containerStyle}>
        <img src={dish.image} alt={dish.name} style={imageStyle} />
        <p style={descriptionStyle}>{dish.description}</p>
        <div style={priceRowStyle}>
          <span style={totalPriceStyle}>
            {totalPrice.toLocaleString('fr-FR')} FCFA
          </span>
          <div style={qtyContainerStyle}>
            <button onClick={() => onChangeQuantity(Math.max(1, quantity - 1))} style={qtyBtnStyle}>
              -
            </button>
            <span style={{ fontWeight: 800 }}>{quantity}</span>
            <button onClick={() => onChangeQuantity(quantity + 1)} style={qtyBtnStyle}>
              +
            </button>
          </div>
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={onAddToCart}>
          Ajouter au panier
        </Button>
      </div>
    </Modal>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '14px'
};

const descriptionStyle = {
  fontSize: '0.88rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.5
};

const priceRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const totalPriceStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const qtyContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const qtyBtnStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800
};
