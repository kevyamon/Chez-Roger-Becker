/**
 * Carte récapitulative financière et validation de commande (CheckoutSummaryCard).
 */

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const CheckoutSummaryCard = ({
  itemsCount,
  subtotal,
  deliveryFee,
  total,
  isSubmitting
}) => {
  return (
    <div className="card-surface" style={cardStyle}>
      <h3 style={sectionHeadingStyle}>3. Paiement à la livraison</h3>
      <p style={helpTextStyle}>
        Vous réglerez le montant total en espèces ou par Mobile Money lors de la réception de votre repas.
      </p>

      <div style={totalBreakdownStyle}>
        <div style={rowStyle}>
          <span>Sous-total ({itemsCount} articles)</span>
          <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div style={rowStyle}>
          <span>Frais de livraison</span>
          <span>{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div style={{ ...rowStyle, ...grandTotalRowStyle }}>
          <span>Total à payer</span>
          <span style={grandTotalPriceStyle}>{total.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        icon={CheckCircle2}
        style={{ marginTop: '16px' }}
      >
        Confirmer ma commande ({total.toLocaleString('fr-FR')} FCFA)
      </Button>
    </div>
  );
};

const cardStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const sectionHeadingStyle = {
  fontSize: '1.02rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const helpTextStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)'
};

const totalBreakdownStyle = {
  borderTop: '1px solid var(--border-color)',
  paddingTop: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '6px'
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.86rem',
  color: 'var(--text-secondary)'
};

const grandTotalRowStyle = {
  borderTop: '1px dashed var(--border-color)',
  paddingTop: '10px',
  fontWeight: 800,
  fontSize: '1.05rem',
  color: 'var(--text-primary)'
};

const grandTotalPriceStyle = {
  color: 'var(--color-primary)',
  fontSize: '1.18rem'
};
