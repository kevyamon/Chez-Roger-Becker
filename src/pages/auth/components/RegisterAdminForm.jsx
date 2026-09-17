/**
 * Formulaire d'inscription administrateur securise par cle privee AD_PW.
 */

import React, { useState } from 'react';
import { UserPlus, KeyRound } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const RegisterAdminForm = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      privateKey: privateKey.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Nom complet</label>
        <input
          type="text"
          placeholder="Votre nom complet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Adresse e-mail</label>
        <input
          type="email"
          placeholder="Votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Numéro de téléphone</label>
        <input
          type="tel"
          placeholder="Votre numéro de téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Mot de passe (8 caractères minimum)</label>
        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>
          <KeyRound size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Clé privée
        </label>
        <input
          type="password"
          placeholder="Entrez votre clé privée"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        icon={UserPlus}
        style={{ marginTop: '8px' }}
      >
        Créer le compte Administrateur
      </Button>
    </form>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};
