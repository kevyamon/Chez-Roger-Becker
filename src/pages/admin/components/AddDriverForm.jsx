/**
 * Formulaire d'ajout d'un nouveau compte livreur.
 */

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export const AddDriverForm = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !password) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={twoColsStyle}>
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Prénom *</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom du livreur"
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Nom *</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom de famille"
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div style={twoColsStyle}>
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Téléphone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Numéro de téléphone"
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Adresse e-mail *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adresse@domaine.com"
            required
            style={inputStyle}
          />
        </div>
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Mot de passe temporaire *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe temporaire"
          required
          style={inputStyle}
        />
      </div>

      <Button type="submit" variant="primary" size="md" fullWidth>
        Enregistrer le livreur
      </Button>
    </form>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingTop: '10px',
  borderTop: '1px solid var(--border-color)'
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
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '0.82rem',
  outline: 'none'
};
