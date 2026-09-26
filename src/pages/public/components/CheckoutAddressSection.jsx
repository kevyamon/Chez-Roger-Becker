/**
 * Section Adresse et Carte GPS pour la commande (CheckoutAddressSection).
 */

import React from 'react';
import { MapPin, CheckCircle } from 'lucide-react';
import { MapPicker } from '../../../components/map/MapPicker';

export const CheckoutAddressSection = ({
  formData,
  onChange,
  location,
  onLocationChange,
  gpsSynced
}) => {
  return (
    <div className="card-surface" style={cardStyle}>
      <h3 style={sectionHeadingStyle}>
        <MapPin size={18} color="var(--color-primary)" /> 2. Lieu de Livraison
      </h3>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Adresse / Quartier / Repère précis *</label>
        <input
          type="text"
          name="address"
          placeholder="Ex : Cité universitaire Abobo 1, Rue principale"
          value={formData.address}
          onChange={onChange}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Instructions pour le livreur (Optionnel)</label>
        <input
          type="text"
          name="note"
          placeholder="Instructions pour le livreur (ex: sonnerie, bâtiment B)"
          value={formData.note}
          onChange={onChange}
        />
      </div>

      <div style={gpsHeaderRowStyle}>
        <label style={labelStyle}>Position GPS sur la carte (ou utilisez le bouton GPS)</label>
        {gpsSynced && (
          <span style={gpsSyncedBadgeStyle}>
            <CheckCircle size={12} /> Position GPS synchronisée
          </span>
        )}
      </div>

      <MapPicker location={location} onLocationChange={onLocationChange} />
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

const gpsHeaderRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
  flexWrap: 'wrap',
  gap: '6px'
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
