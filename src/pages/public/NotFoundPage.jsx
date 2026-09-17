/**
 * Page 404 discrete (Page non trouvee).
 * Masque l'existence des routes administratives pour les utilisateurs non autorises.
 */

import React from 'react';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in" style={containerStyle}>
      <div className="card-surface" style={cardStyle}>
        <div style={iconBadgeStyle}>
          <AlertCircle size={32} color="var(--color-primary)" />
        </div>
        <h2 style={titleStyle}>Page non trouvée</h2>
        <p style={descStyle}>
          La ressource que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button
          variant="primary"
          size="md"
          icon={Home}
          onClick={() => onNavigate('home')}
          style={{ marginTop: '8px' }}
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '40px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh'
};

const cardStyle = {
  padding: '32px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '12px',
  maxWidth: '380px',
  width: '100%'
};

const iconBadgeStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.1))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '4px'
};

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const descStyle = {
  fontSize: '0.86rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
  marginBottom: '6px'
};
