/**
 * Section Gestion des Livreurs (AdminDriversSection).
 * Suivi de la flotte de livreurs, de leur disponibilité et création de comptes.
 */

import React, { useState } from 'react';
import { Bike, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AddDriverForm } from './AddDriverForm';
import { DriverCard } from './DriverCard';

export const AdminDriversSection = ({
  drivers = [],
  onCreateDriver
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleFormSubmit = (data) => {
    onCreateDriver(data);
    setShowAddForm(false);
  };

  return (
    <div style={containerStyle}>
      <div className="card-surface" style={actionHeaderCardStyle}>
        <div style={headerTitleRowStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Flotte de Livraison</h3>
            <span style={subtitleStyle}>{drivers.length} livreur(s) enregistré(s)</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Fermer' : 'Nouveau Livreur'}
          </Button>
        </div>

        {showAddForm && <AddDriverForm onSubmit={handleFormSubmit} />}
      </div>

      {/* Liste des livreurs */}
      <div style={driversListStyle}>
        {drivers.length === 0 ? (
          <div className="card-surface" style={emptyCardStyle}>
            <Bike size={32} color="var(--text-muted)" />
            <p style={emptyTextStyle}>Aucun compte livreur créé pour le moment.</p>
          </div>
        ) : (
          drivers.map((driver) => (
            <DriverCard key={driver._id} driver={driver} />
          ))
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const actionHeaderCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const headerTitleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const sectionTitleStyle = {
  fontSize: '0.96rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const subtitleStyle = {
  fontSize: '0.76rem',
  color: 'var(--text-secondary)'
};

const driversListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const emptyCardStyle = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  textAlign: 'center'
};

const emptyTextStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-muted)'
};

