/**
 * Composant d'affichage de la chronologie des statuts d'une commande (AdminOrderTimeline).
 */

import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { theme } from '../../../styles/theme';
import { getOrderStatusLabel } from '../../../utils/statusLabels';

export const AdminOrderTimeline = ({ statusHistory = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseignée';
    const d = new Date(dateString);
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div style={sectionBoxStyle}>
      <div style={sectionTitleStyle}>
        <Clock size={16} /> Chronologie des étapes
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {statusHistory.map((step, idx) => (
          <div key={idx} style={stepRowStyle}>
            <CheckCircle size={14} color="var(--status-success)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {getOrderStatusLabel(step.status)}
              </div>
              {step.note && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{step.note}</div>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formatDate(step.changedAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const sectionBoxStyle = {
  padding: '12px 14px',
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: theme.radii.md,
  border: '1px solid var(--border-color)'
};

const sectionTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

const stepRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '6px 0',
  borderBottom: '1px dashed var(--border-color)'
};
