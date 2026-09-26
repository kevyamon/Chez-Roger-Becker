/**
 * Formulaire de sécurité et mot de passe du livreur (DriverSecurityForm).
 * Permet de modifier le code ou mot de passe d'accès sécurisé.
 */

import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const DriverSecurityForm = () => {
  const { showSuccess, showError } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      return showError('Veuillez renseigner tous les champs de mot de passe.');
    }

    if (newPassword !== confirmPassword) {
      return showError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
    }

    if (newPassword.length < 4) {
      return showError('Le mot de passe doit comporter au moins 4 caractères.');
    }

    try {
      setIsLoading(true);
      const res = await apiClient.patch('/driver/change-password', {
        oldPassword,
        newPassword
      });

      if (res.success) {
        showSuccess('Votre mot de passe a été modifié avec succès.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showError(err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle} className="animate-fade-in">
      <div style={fieldGroupStyle}>
        <label style={labelStyle}>
          <Lock size={14} color="var(--color-primary)" /> Mot de passe ou code actuel *
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Votre mot de passe actuel"
          required
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>
          <ShieldCheck size={14} color="var(--color-primary)" /> Nouveau mot de passe *
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Minimum 4 caractères"
          required
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>
          <ShieldCheck size={14} color="var(--color-primary)" /> Confirmer le nouveau mot de passe *
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Répétez le nouveau mot de passe"
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={isLoading}
        icon={Lock}
        style={{ marginTop: '6px' }}
      >
        Changer mon mot de passe
      </Button>
    </form>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
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
