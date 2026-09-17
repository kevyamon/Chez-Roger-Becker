/**
 * Page de finalisation de commande sans compte (Checkout).
 * Parcours ultra-fluide : Nom/Téléphone -> Adresse/GPS -> Confirmation immédiate.
 */

import React, { useState } from 'react';
import { User, Phone, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../services/api';
import { MapPicker } from '../../components/map/MapPicker';
import { Button } from '../../components/ui/Button';

export const CheckoutPage = ({ onNavigate, onOrderSuccess }) => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });

  const [location, setLocation] = useState({
    type: 'Point',
    coordinates: [-4.0083, 5.3599] // Abidjan par défaut
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return showError('Veuillez renseigner votre nom complet.');
    if (!formData.phone.trim()) return showError('Veuillez renseigner votre numéro de téléphone.');
    if (!formData.address.trim()) return showError('Veuillez indiquer une adresse ou un repère de livraison.');
    if (items.length === 0) return showError('Votre panier est vide.');

    try {
      setIsSubmitting(true);
      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim()
        },
        items: items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || []
        })),
        delivery: {
          address: formData.address.trim(),
          note: formData.note.trim(),
          location: {
            type: 'Point',
            coordinates: location.coordinates
          }
        },
        paymentMethod: 'CASH_ON_DELIVERY'
      };

      const res = await apiClient.post('/orders', payload);

      if (res.success && res.data?.order) {
        const createdOrder = res.data.order;
        clearCart();
        showSuccess('Votre commande a été enregistrée avec succès !');
        if (onOrderSuccess) {
          onOrderSuccess(createdOrder.trackingToken);
        }
      }
    } catch (err) {
      showError(err.message || 'Échec lors de la création de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <div style={topNavStyle}>
        <button onClick={() => onNavigate('cart')} style={backButtonStyle}>
          <ArrowLeft size={18} /> Panier
        </button>
        <h2 style={pageTitleStyle}>Finaliser la commande</h2>
      </div>

      <form onSubmit={handleSubmitOrder} style={formStyle}>
        {/* ÉTAPE 1 : COORDONNÉES CLIENT */}
        <div className="card-surface" style={cardStyle}>
          <h3 style={sectionHeadingStyle}>
            <User size={18} color="var(--color-primary)" /> 1. Vos Coordonnées
          </h3>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nom complet *</label>
            <input
              type="text"
              name="name"
              placeholder="Votre nom complet"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Numéro de téléphone (joignable) *</label>
            <input
              type="tel"
              name="phone"
              placeholder="Votre numéro de téléphone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* ÉTAPE 2 : ADRESSE & GÉOLOCALISATION */}
        <div className="card-surface" style={cardStyle}>
          <h3 style={sectionHeadingStyle}>
            <MapPin size={18} color="var(--color-primary)" /> 2. Lieu de Livraison
          </h3>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Adresse / Quartier / Repère précis *</label>
            <input
              type="text"
              name="address"
              placeholder="Adresse ou repère précis de livraison"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Instructions pour le livreur (Optionnel)</label>
            <input
              type="text"
              name="note"
              placeholder="Instructions pour le livreur (ex: sonnerie, étage)"
              value={formData.note}
              onChange={handleChange}
            />
          </div>

          <label style={{ ...labelStyle, marginTop: '8px' }}>Position GPS sur la carte (glissez le repère)</label>
          <MapPicker location={location} onLocationChange={setLocation} />
        </div>

        {/* ÉTAPE 3 : RÉCAPITULATIF FINANCIER & PAIEMENT */}
        <div className="card-surface" style={cardStyle}>
          <h3 style={sectionHeadingStyle}>3. Paiement à la livraison</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Vous réglerez le montant total en espèces ou par Mobile Money lors de la réception de votre repas.
          </p>

          <div style={totalBreakdownStyle}>
            <div style={rowStyle}>
              <span>Sous-total ({items.length} articles)</span>
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
      </form>
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  paddingBottom: '30px'
};

const topNavStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.86rem',
  fontWeight: 700,
  color: 'var(--color-primary)'
};

const pageTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
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
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
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
