/**
 * Section Gestion des Livreurs (AdminDriversSection).
 * Suivi de la flotte de livreurs, de leur disponibilité, création et modification avec états squelettes.
 */

import React, { useState } from 'react';
import { Bike, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AddDriverForm } from './AddDriverForm';
import { DriverCard } from './DriverCard';
import { Skeleton } from '../../../components/ui/Skeleton';

export const AdminDriversSection = ({
  drivers = [],
  onCreateDriver,
  onUpdateDriver,
  onDeleteDriver,
  isLoading = false
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleFormSubmit = async (data) => {
    const success = await onCreateDriver(data);
    if (success) {
      setShowAddForm(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="card-surface" style={actionHeaderCardStyle}>
        <div style={headerTitleRowStyle}>
          <div>
            <h3 style={sectionTitleStyle}>Flotte de Livraison</h3>
            {isLoading ? (
              <Skeleton width="85px" height="12px" style={{ marginTop: '3px' }} />
            ) : (
              <span style={subtitleStyle}>{drivers.length} livreur(s) enregistré(s)</span>
            )}
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

      {/* Liste des livreurs ou Skeletons */}
      <div style={driversListStyle}>
        {isLoading ? (
          [1, 2].map((idx) => (
            <div key={idx} className="card-surface" style={skeletonCardStyle}>
              <div style={skeletonHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Skeleton width="36px" height="36px" borderRadius="10px" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Skeleton width="120px" height="14px" />
                    <Skeleton width="80px" height="11px" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Skeleton width="65px" height="20px" borderRadius="6px" />
                  <Skeleton width="24px" height="24px" borderRadius="6px" />
                  <Skeleton width="24px" height="24px" borderRadius="6px" />
                </div>
              </div>
              <div style={skeletonDetailsStyle}>
                <Skeleton width="45%" height="13px" />
                <Skeleton width="55%" height="13px" />
              </div>
            </div>
          ))
        ) : drivers.length === 0 ? (
          <div className="card-surface" style={emptyCardStyle}>
            <Bike size={32} color="var(--text-muted)" />
            <p style={emptyTextStyle}>Aucun compte livreur créé pour le moment.</p>
          </div>
        ) : (
          drivers.map((driver) => (
            <DriverCard
              key={driver._id}
              driver={driver}
              onUpdateDriver={onUpdateDriver}
              onDeleteDriver={onDeleteDriver}
            />
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
  gap: '12px',
  borderRadius: '12px'
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

const skeletonCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  borderRadius: '12px'
};

const skeletonHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px'
};

const skeletonDetailsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  paddingTop: '8px',
  borderTop: '1px solid var(--border-color)'
};

const emptyCardStyle = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  textAlign: 'center',
  borderRadius: '12px'
};

const emptyTextStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-muted)'
};
