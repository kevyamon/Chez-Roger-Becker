/**
 * Section Configuration et Paramètres du Restaurant (AdminSettingsSection).
 * Modifie les horaires, l'adresse, les frais de livraison et les messages d'état.
 */

import React, { useState, useEffect } from 'react';
import { Save, Clock, MapPin, Phone, DollarSign, Store } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const AdminSettingsSection = ({
  settings,
  onSaveSettings,
  isLoading
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('1000');
  const [closedMessage, setClosedMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setName(settings.name || 'Chez Roger Becker');
      setPhone(settings.phone || '+225 07 00 00 00 00');
      setAddress(settings.address || 'Cocody Vallon, Rue des Jardins, Abidjan, Côte d\'Ivoire');
      setOpeningHours(settings.openingHours || 'Mardi – Dimanche : 11h00 – 23h00 (Fermé le lundi)');
      setDeliveryFee(settings.deliveryFee ? String(settings.deliveryFee) : '1000');
      setClosedMessage(settings.closedMessage || 'Le restaurant est actuellement fermé.');
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      openingHours: openingHours.trim(),
      deliveryFee: Number(deliveryFee) || 1000,
      closedMessage: closedMessage.trim()
    });
  };

  return (
    <div style={containerStyle}>
      <div className="card-surface" style={cardStyle}>
        <div style={headerStyle}>
          <Store size={20} color="var(--color-primary)" />
          <h3 style={titleStyle}>Paramètres Généraux du Restaurant</h3>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Nom de l'établissement</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={twoColsStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <DollarSign size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Frais de livraison (FCFA)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                required
                min="0"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Adresse géographique complète
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Horaires d'ouverture
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Message affiché lors de la fermeture</label>
            <textarea
              value={closedMessage}
              onChange={(e) => setClosedMessage(e.target.value)}
              rows={2}
              style={textareaStyle}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
            isLoading={isLoading}
            style={{ marginTop: '8px' }}
          >
            Enregistrer les paramètres
          </Button>
        </form>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const cardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const titleStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const twoColsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px'
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};

const inputStyle = {
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '0.84rem',
  outline: 'none'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit'
};
