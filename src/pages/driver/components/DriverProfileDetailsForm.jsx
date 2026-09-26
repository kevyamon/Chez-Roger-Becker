/**
 * Formulaire de modification des coordonnées du livreur (DriverProfileDetailsForm).
 * Permet de mettre à jour le prénom, nom, téléphone et adresse e-mail.
 */

import React, { useState } from 'react';
import { Save, User, Phone, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const DriverProfileDetailsForm = ({ user, onProfileUpdated }) => {
  const { showSuccess, showError } = useToast();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
      return showError('Veuillez remplir tous les champs obligatoires.');
    }

    try {
      setIsLoading(true);
      const res = await apiClient.patch('/driver/profile', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim()
      });

      if (res.success && res.data?.user) {
        showSuccess('Vos coordonnées ont été mises à jour avec succès.');
        if (onProfileUpdated) {
          onProfileUpdated(res.data.user);
        }
      }
    } catch (err) {
      showError(err.message || 'Impossible de mettre à jour votre profil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle} className="animate-fade-in">
      <div style={gridStyle}>
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            <User size={14} color="var(--color-primary)" /> Prénom *
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Votre prénom"
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>
            <User size={14} color="var(--color-primary)" /> Nom *
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Votre nom"
            required
          />
        </div>
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>
          <Phone size={14} color="var(--color-primary)" /> Numéro de téléphone *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ex: 0700000000"
          required
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>
          <Mail size={14} color="var(--color-primary)" /> Adresse e-mail *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre.email@exemple.com"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={isLoading}
        icon={Save}
        style={{ marginTop: '6px' }}
      >
        Mettre à jour mes informations
      </Button>
    </form>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: '12px'
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '0.80rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
};
