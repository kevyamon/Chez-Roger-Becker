/**
 * Page de finalisation de commande sans compte (Checkout).
 * Parcours fluide : Nom/Téléphone -> Adresse/GPS -> Confirmation immédiate.
 */

import React, { useState } from 'react';
import { User, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { usePushNotification } from '../../context/PushNotificationContext';
import { apiClient } from '../../services/api';
import { CheckoutAddressSection } from './components/CheckoutAddressSection';
import { CheckoutSummaryCard } from './components/CheckoutSummaryCard';

export const CheckoutPage = ({ onNavigate, onOrderSuccess }) => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { showError, showSuccess } = useToast();
  const { linkOrderToPush } = usePushNotification();

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

  const [gpsSynced, setGpsSynced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    if (newLocation.resolvedAddress) {
      setFormData((prev) => ({
        ...prev,
        address: newLocation.resolvedAddress
      }));
      setGpsSynced(true);
    }
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
          console.warn('Erreur de sauvegarde locale de la commande :', e);
        }

        if (createdOrder.trackingToken) {
          linkOrderToPush(createdOrder.trackingToken);
        }

        clearCart();
        showSuccess('Votre commande a été enregistrée avec succès !');
        if (onOrderSuccess) {
          onOrderSuccess(createdOrder.trackingToken);
        }
      }
    } catch (err) {
      if (err.code === 'RESTAURANT_CLOSED' || err.message?.toLowerCase()?.includes('fermé')) {
        showError('La commande n\'est pas possible actuellement car le restaurant est fermé.');
      } else {
        showError(err.message || 'Échec lors de la création de la commande.');
      }
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
        <CheckoutAddressSection
          formData={formData}
          onChange={handleChange}
          location={location}
          onLocationChange={handleLocationChange}
          gpsSynced={gpsSynced}
        />

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
  color: 'var(--color-primary)',
  background: 'none',
  border: 'none',
  cursor: 'pointer'
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

const gpsSyncedBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--status-success, #16A34A)',
  backgroundColor: 'rgba(22, 163, 74, 0.12)',
  padding: '2px 8px',
  borderRadius: '9999px'
};
