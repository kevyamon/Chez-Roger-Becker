/**
 * Formulaire de connexion administrateur et personnel.
 */

import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const LoginForm = ({ onSubmit, isLoading }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ identifier: identifier.trim(), password });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Adresse e-mail ou numéro de téléphone</label>
        <input
          type="text"
          placeholder="Votre adresse e-mail ou téléphone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Mot de passe</label>
        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        icon={LogIn}
        style={{ marginTop: '8px' }}
      >
        Se connecter
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
