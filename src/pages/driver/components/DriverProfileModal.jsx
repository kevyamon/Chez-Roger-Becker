/**
 * Modale de gestion du profil livreur (DriverProfileModal).
 * Permet au livreur de modifier ses coordonnées personnelles et de changer son mot de passe ou code.
 */

import React, { useState } from 'react';
import { X, User, Lock, Save, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const DriverProfileModal = ({ user, onClose, onProfileUpdated }) => {
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'password'

  // Informations générales
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Mot de passe
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateInfo = async (e) => {
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
        if (onProfileUpdated) onProfileUpdated(res.data.user);
        onClose();
      }
    } catch (err) {
      showError(err.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
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
        showSuccess('Votre mot de passe ou code d\'accès a été changé.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }
    } catch (err) {
      showError(err.message || 'Erreur lors du changement de mot de passe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div className="card-surface" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={titleWrapStyle}>
            <User size={20} color="var(--color-primary)" />
            <h3 style={titleStyle}>Mon Compte Livreur</h3>
          </div>
          <button onClick={onClose} style={closeButtonStyle}>
            <X size={20} />
          </button>
        </div>

        {/* Onglets de navigation */}
        <div style={tabSwitcherStyle}>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            style={activeTab === 'info' ? activeTabBtnStyle : inactiveTabBtnStyle}
          >
            Coordonnées
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            style={activeTab === 'password' ? activeTabBtnStyle : inactiveTabBtnStyle}
          >
            Mot de passe / Code
          </button>
        </div>

        {activeTab === 'info' ? (
          <form onSubmit={handleUpdateInfo} style={formStyle}>
            <div style={twoColsStyle}>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Prénom *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Nom *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Numéro de téléphone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Adresse e-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth disabled={isLoading} icon={Save}>
              {isLoading ? 'Enregistrement...' : 'Mettre à jour mes informations'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} style={formStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Mot de passe / Code actuel *</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Votre mot de passe actuel"
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Nouveau mot de passe / Code *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 4 caractères"
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Confirmer le nouveau mot de passe *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le nouveau mot de passe"
                style={inputStyle}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth disabled={isLoading} icon={Lock}>
              {isLoading ? 'Modification...' : 'Changer mon mot de passe'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(6px)',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px'
};

const modalStyle = {
  width: '100%',
  maxWidth: '440px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '90vh',
  overflowY: 'auto'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const titleWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const titleStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const closeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const tabSwitcherStyle = {
  display: 'flex',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '8px',
  padding: '3px'
};

const activeTabBtnStyle = {
  flex: 1,
  padding: '8px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  fontSize: '0.8rem',
  fontWeight: 700,
  cursor: 'pointer'
};

const inactiveTabBtnStyle = {
  flex: 1,
  padding: '8px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer'
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
  fontSize: '0.76rem',
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
