/**
 * Bannière d'incitation à l'installation PWA (Android, iOS et Desktop).
 * Design gastronomique soigné avec déclenchement direct de l'invite native.
 */

import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import logoImg from '../../assets/images/logo.png';
import { Button } from './Button';

export const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIosPrompt, setIsIosPrompt] = useState(false);

  useEffect(() => {
    // Vérifie si l'application est déjà en mode autonome (PWA installée)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Détection iOS (Safari ne supporte pas beforeinstallprompt)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isDismissed = sessionStorage.getItem('rb_pwa_prompt_dismissed');

    if (isIos && !isDismissed) {
      const timer = setTimeout(() => {
        setIsIosPrompt(true);
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('rb_pwa_prompt_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div style={modalOverlayStyle}>
      <div className="card-surface" style={modalCardStyle}>
        <button
          onClick={handleDismiss}
          style={closeButtonStyle}
          aria-label="Fermer la boîte de dialogue"
        >
          <X size={18} color="var(--text-muted)" />
        </button>

        <div style={logoContainerStyle}>
          <img
            src={logoImg}
            alt="Chez Roger Becker"
            style={logoStyle}
          />
        </div>

        <div style={textContainerStyle}>
          <h3 style={titleStyle}>Installer l'application</h3>
          <span style={appNameBadgeStyle}>Chez Roger Becker</span>
          <p style={subtitleStyle}>
            {isIosPrompt
              ? 'Pour installer l\'application sur votre iPhone, touchez l\'icône Partager puis sélectionnez "Sur l\'écran d\'accueil".'
              : 'Accédez directement au menu, commandez vos grillades en un clic et suivez vos livraisons en temps réel.'}
          </p>
        </div>

        <div style={actionsContainerStyle}>
          {isIosPrompt ? (
            <div style={iosHintBoxStyle}>
              <Share size={18} color="var(--color-primary)" />
              <span>Partager &gt; <strong>Sur l'écran d'accueil</strong></span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={Download}
              onClick={handleInstallClick}
              fullWidth
            >
              Installer l'application
            </Button>
          )}

          <button onClick={handleDismiss} style={dismissButtonStyle}>
            Continuer sur le navigateur
          </button>
        </div>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  zIndex: 999
};

const modalCardStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '360px',
  padding: '24px 20px',
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '14px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
  border: '1.5px solid var(--color-primary-light, rgba(230, 81, 0, 0.3))'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer'
};

const logoContainerStyle = {
  marginTop: '4px'
};

const logoStyle = {
  width: '58px',
  height: '58px',
  borderRadius: '14px',
  objectFit: 'contain',
  backgroundColor: '#000000',
  boxShadow: '0 4px 14px rgba(230, 81, 0, 0.3)'
};

const textContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px'
};

const titleStyle = {
  fontSize: '1.2rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const appNameBadgeStyle = {
  fontSize: '0.76rem',
  fontWeight: 700,
  color: 'var(--color-primary-dark, #BF360C)',
  backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.12))',
  padding: '3px 10px',
  borderRadius: '9999px',
  width: 'fit-content'
};

const subtitleStyle = {
  fontSize: '0.80rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.45,
  marginTop: '4px'
};

const actionsContainerStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  marginTop: '6px'
};

const dismissButtonStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  backgroundColor: 'transparent',
  border: 'none',
  padding: '6px 12px',
  cursor: 'pointer'
};

const iosHintBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.12))',
  color: 'var(--text-primary)',
  fontSize: '0.82rem',
  border: '1px solid var(--color-primary-light, rgba(230, 81, 0, 0.25))'
};
