/**
 * Bannière discrète d'incitation à l'activation des notifications push (NotificationPermissionBanner).
 * S'intègre avec le design system (theme.js), icône Lucide Bell, zéro emoji.
 */

import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { usePushNotification } from '../../context/PushNotificationContext';
import { theme } from '../../styles/theme';

export const NotificationPermissionBanner = ({ role = 'CUSTOMER', trackingToken = null }) => {
  const { permissionStatus, requestPushPermission, isSupported } = usePushNotification();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ne pas afficher si non supporté, déjà autorisé, refusé ou masqué manuellement
  if (!isSupported || permissionStatus !== 'default' || dismissed) {
    return null;
  }

  const handleActivate = async () => {
    setLoading(true);
    try {
      await requestPushPermission({ role, trackingToken });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: '12px 16px',
        padding: '14px 16px',
        backgroundColor: 'var(--bg-elevated, #FFFFFF)',
        border: '1px solid var(--border-color, #E2E8F0)',
        borderRadius: theme.radii.md,
        boxShadow: 'var(--card-shadow, 0 4px 20px rgba(0,0,0,0.06))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: theme.radii.sm,
            backgroundColor: 'var(--color-primary-surface, #FFF3E0)',
            color: 'var(--color-primary, #E65100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Bell size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
            Suivi des commandes en direct
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #475569)' }}>
            Recevez les alertes de préparation et de livraison sur votre appareil.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={handleActivate}
          disabled={loading}
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--color-primary, #E65100)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: theme.radii.sm,
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer'
          }}
        >
          {loading ? 'Activation...' : 'Activer'}
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            padding: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted, #94A3B8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
