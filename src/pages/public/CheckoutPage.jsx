/**
 * Page de finalisation de commande sans compte (Checkout).
 * Parcours ultra-fluide : Nom/Téléphone -> Adresse/GPS -> Confirmation immédiate.
 */

import React, { useState } from 'react';
import { User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { apiClient } from '../../services/api';
import { MapPicker } from '../../components/map/MapPicker';
import { CheckoutSummaryCard } from './components/CheckoutSummaryCard';

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

        // Enregistrement automatique dans l'historique local du navigateur
        try {
          const historyItem = {
            trackingToken: createdOrder.trackingToken,
            orderNumber: createdOrder.orderNumber,
            createdAt: createdOrder.createdAt || new Date().toISOString(),
            total: createdOrder.total,
            itemsCount: items.reduce((sum, i) => sum + i.quantity, 0),
            firstItemName: items[0]?.name || 'Commande',
            status: createdOrder.status || 'PENDING'
          };
          const existing = JSON.parse(localStorage.getItem('rb_orders_history') || '[]');
          const filtered = existing.filter(
            (o) => o.trackingToken !== createdOrder.trackingToken && o.orderNumber !== createdOrder.orderNumber
          );
          localStorage.setItem('rb_orders_history', JSON.stringify([historyItem, ...filtered].slice(0, 30)));
        } catch (e) {
          console.warn('Erreur de sauvegarde locale de la commande:', e);
        }

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
        <CheckoutSummaryCard
          itemsCount={items.length}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          isSubmitting={isSubmitting}
        />
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

