/**
 * Page de gestion du panier d'achat (/panier).
 * Affiche la liste des articles, les ajustements de quantités et le résumé financier.
 */

import React from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';

export const CartPage = ({ onNavigate }) => {
  const { items, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="animate-fade-in" style={emptyContainerStyle}>
        <div style={emptyIconCircleStyle}>
          <ShoppingBag size={48} color="var(--color-primary)" />
        </div>
        <h3 style={emptyTitleStyle}>Votre panier est vide</h3>
        <p style={emptySubtitleStyle}>Laissez-vous tenter par nos délicieuses grillades et spécialités cuites au feu de bois.</p>
        <Button variant="primary" size="lg" onClick={() => onNavigate('menu')} style={{ marginTop: '12px' }}>
          Découvrir la carte
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Votre Panier</h2>
        <button onClick={clearCart} style={clearButtonStyle}>
          Vider le panier
        </button>
      </div>

      {/* LISTE DES ARTICLES */}
      <div style={itemsListStyle}>
        {items.map((item) => (
          <div key={item.dishId} className="card-surface" style={itemCardStyle}>
            <img
              src={item.image}
              alt={item.name}
              style={itemImageStyle}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80';
              }}
            />
            <div style={itemInfoStyle}>
              <h4 style={itemNameStyle}>{item.name}</h4>
              <span style={itemPriceStyle}>{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>

              <div style={quantityControlsStyle}>
                <button onClick={() => updateQuantity(item.dishId, -1)} style={qtyBtnStyle}>
                  <Minus size={14} />
                </button>
                <span style={qtyTextStyle}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dishId, 1)} style={qtyBtnStyle}>
                  <Plus size={14} />
                </button>
                <button onClick={() => removeItem(item.dishId)} style={removeBtnStyle}>
                  <Trash2 size={15} color="#DC2626" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RÉSUMÉ DE COMMANDE */}
      <div className="card-surface" style={summaryCardStyle}>
        <h3 style={summaryTitleStyle}>Résumé de la commande</h3>
        <div style={summaryRowStyle}>
          <span>Sous-total</span>
          <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div style={summaryRowStyle}>
          <span>Frais de livraison</span>
          <span>{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div style={{ ...summaryRowStyle, ...totalRowStyle }}>
          <span>Total à régler</span>
          <span style={totalPriceStyle}>{total.toLocaleString('fr-FR')} FCFA</span>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onNavigate('checkout')}
          icon={ArrowRight}
          style={{ marginTop: '16px' }}
        >
          Valider ma commande
        </Button>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingBottom: '30px'
};

const emptyContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 24px',
  textAlign: 'center',
  gap: '14px'
};

const emptyIconCircleStyle = {
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const emptyTitleStyle = {
  fontSize: '1.4rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const emptySubtitleStyle = {
  fontSize: '0.88rem',
  color: 'var(--text-secondary)',
  maxWidth: '320px',
  lineHeight: 1.5
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const titleStyle = {
  fontSize: '1.4rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const clearButtonStyle = {
  fontSize: '0.8rem',
  color: '#DC2626',
  fontWeight: 600
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const itemCardStyle = {
  display: 'flex',
  gap: '14px',
  padding: '12px'
};

const itemImageStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '12px',
  objectFit: 'cover'
};

const itemInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1
};

const itemNameStyle = {
  fontSize: '0.94rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const itemPriceStyle = {
  fontSize: '0.94rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const quantityControlsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginTop: '6px'
};

const qtyBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-primary)'
};

const qtyTextStyle = {
  fontSize: '0.88rem',
  fontWeight: 700
};

const removeBtnStyle = {
  marginLeft: 'auto',
  padding: '6px'
};

const summaryCardStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const summaryTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  marginBottom: '6px'
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.88rem',
  color: 'var(--text-secondary)'
};

const totalRowStyle = {
  borderTop: '1px dashed var(--border-color)',
  paddingTop: '12px',
  marginTop: '4px',
  fontSize: '1.1rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const totalPriceStyle = {
  color: 'var(--color-primary)',
  fontSize: '1.2rem'
};
