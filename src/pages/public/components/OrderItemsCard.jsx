/**
 * Carte listant les articles d'une commande et le montant total (OrderItemsCard).
 */

import React from 'react';
import { Utensils } from 'lucide-react';

export const OrderItemsCard = ({ items = [], total = 0 }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="card-surface" style={itemsCardStyle}>
      <div style={itemsHeaderStyle}>
        <Utensils size={18} color="var(--color-primary)" />
        <h4 style={sectionTitleStyle}>Articles commandés ({items.length})</h4>
      </div>
      <div style={itemsListStyle}>
        {items.map((item, idx) => (
          <div key={idx} style={itemRowStyle}>
            <div>
              <span style={itemNameStyle}>{item.quantity}x {item.name}</span>
            </div>
            <span style={itemPriceStyle}>
              {((item.subtotal || item.unitPrice * item.quantity)).toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        ))}
        <div style={totalRowStyle}>
          <span>Total réglé / à régler</span>
          <span style={totalPriceStyle}>{total?.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>
    </div>
  );
};

const itemsCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const itemsHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const sectionTitleStyle = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.84rem'
};

const itemNameStyle = {
  color: 'var(--text-primary)',
  fontWeight: 600
};

const itemPriceStyle = {
  color: 'var(--text-secondary)',
  fontWeight: 700
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px dashed var(--border-color)',
  paddingTop: '10px',
  marginTop: '4px',
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const totalPriceStyle = {
  color: 'var(--color-primary)',
  fontSize: '1.05rem'
};
