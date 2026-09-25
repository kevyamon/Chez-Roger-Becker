/**
 * Carte individuelle affichant les détails d'un livreur et son statut pour l'Administrateur (DriverCard).
 * Permet d'éditer le livreur, réinitialiser son mot de passe ou le supprimer.
 */

import React, { useState } from 'react';
import { Bike, Phone, Mail, Edit2, Trash2, Key, Check, X } from 'lucide-react';
import { getDriverStatusLabel } from '../../../constants/statusLabels';

export const DriverCard = ({ driver, onUpdateDriver, onDeleteDriver }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(driver.firstName || '');
  const [lastName, setLastName] = useState(driver.lastName || '');
  const [phone, setPhone] = useState(driver.phone || '');
  const [email, setEmail] = useState(driver.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [isActive, setIsActive] = useState(driver.isActive !== false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return { bg: 'rgba(34, 197, 94, 0.12)', color: 'var(--status-success, #16A34A)' };
      case 'BUSY':
        return { bg: 'rgba(230, 81, 0, 0.12)', color: 'var(--color-primary, #E65100)' };
      default:
        return { bg: 'var(--bg-card-header)', color: 'var(--text-muted)' };
    }
  };

  const badge = getStatusBadge(driver.driverStatus);

  const handleSave = () => {
    const updatePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      isActive
    };
    if (newPassword.trim()) {
      updatePayload.password = newPassword.trim();
    }
    onUpdateDriver(driver._id, updatePayload);
    setIsEditing(false);
    setNewPassword('');
  };

  return (
    <div className="card-surface" style={driverCardStyle}>
      <div style={driverHeaderStyle}>
        <div style={driverNameWrapStyle}>
          <div style={avatarStyle}>
            <Bike size={18} color="var(--color-primary)" />
          </div>
          <div>
            <h4 style={driverNameStyle}>{driver.firstName} {driver.lastName}</h4>
            <span style={{ fontSize: '0.72rem', color: driver.isActive ? 'var(--text-muted)' : 'var(--status-error)' }}>
              {driver.isActive ? 'Livreur officiel' : 'Compte désactivé'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ ...statusBadgeStyle, backgroundColor: badge.bg, color: badge.color }}>
            {getDriverStatusLabel(driver.driverStatus)}
          </span>
          <button onClick={() => setIsEditing(!isEditing)} style={actionIconBtnStyle} title="Modifier le livreur">
            <Edit2 size={15} color="var(--color-primary)" />
          </button>
          <button onClick={() => onDeleteDriver(driver._id)} style={actionIconBtnStyle} title="Supprimer le livreur">
            <Trash2 size={15} color="var(--status-error)" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div style={editFormStyle}>
          <div style={twoColsStyle}>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" style={inputStyle} />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom" style={inputStyle} />
          </div>
          <div style={twoColsStyle}>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" style={inputStyle} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Key size={14} color="var(--color-primary)" />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" style={{ ...inputStyle, flex: 1 }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px 0' }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Compte actif et autorisé à livrer
          </label>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={() => setIsEditing(false)} style={cancelBtnStyle}><X size={14} /> Annuler</button>
            <button onClick={handleSave} style={saveBtnStyle}><Check size={14} /> Enregistrer</button>
          </div>
        </div>
      ) : (
        <div style={driverDetailsStyle}>
          <div style={infoRowStyle}>
            <Phone size={13} color="var(--color-primary)" />
            <a href={`tel:${driver.phone}`} style={linkStyle}>{driver.phone}</a>
          </div>
          <div style={infoRowStyle}>
            <Mail size={13} color="var(--color-primary)" />
            <span>{driver.email}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const driverCardStyle = { padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', borderRadius: '12px' };
const driverHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' };
const driverNameWrapStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const avatarStyle = { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const driverNameStyle = { fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' };
const statusBadgeStyle = { fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' };
const actionIconBtnStyle = { padding: '6px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const driverDetailsStyle = { display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' };
const infoRowStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' };
const linkStyle = { color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' };
const editFormStyle = { display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' };
const twoColsStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' };
const inputStyle = { padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' };
const saveBtnStyle = { padding: '6px 12px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const cancelBtnStyle = { padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
