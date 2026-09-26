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
    <div className="animate-fade-in" style={bannerOverlayStyle}>
      <div className="card-surface" style={bannerCardStyle}>
        <button
          onClick={handleDismiss}
          style={closeButtonStyle}
          aria-label="Fermer la bannière"
        >
          <X size={18} color="var(--text-muted)" />
        </button>

        <div style={contentRowStyle}>
          <img
            src={logoImg}
            alt="Chez Roger Becker"
            style={logoStyle}
          />
          <div style={textContainerStyle}>
            <h4 style={titleStyle}>Installer l'application</h4>
            <p style={subtitleStyle}>
              {isIosPrompt
                ? 'Appuyez sur Partager puis "Sur l\'écran d\'accueil" pour l\'ajouter.'
                : 'Accédez à vos grillades et suivez vos commandes en 1 clic.'}
            </p>
          </div>
        </div>

        <div style={actionsRowStyle}>
          <button onClick={handleDismiss} style={laterButtonStyle}>
            Plus tard
          </button>

          {isIosPrompt ? (
            <div style={iosHintStyle}>
              <Share size={14} /> Partager &gt; Sur l'écran d'accueil
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={handleInstallClick}
              style={{ flex: 1 }}
            >
              Installer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const bannerOverlayStyle = {
  position: 'fixed',
  bottom: 'calc(75px + env(safe-area-inset-bottom, 0px))',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 24px)',
  maxWidth: '440px',
  zIndex: 100,
  pointerEvents: 'auto'
};

const bannerCardStyle = {
  position: 'relative',
  padding: '14px 16px',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.16)',
  border: '1.5px solid var(--color-primary-light, rgba(230, 81, 0, 0.25))'
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-elevated)',
  border: 'none',
  cursor: 'pointer'
};

const contentRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const logoStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '10px',
  objectFit: 'contain',
  backgroundColor: '#000000',
  flexShrink: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const textContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  paddingRight: '20px'
};

const titleStyle = {
  fontSize: '0.92rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.2
};

const subtitleStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.3
};

const actionsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '2px'
};

const laterButtonStyle = {
  padding: '7px 12px',
  fontSize: '0.76rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer'
};

const iosHintStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.12))',
  color: 'var(--color-primary-dark, #BF360C)',
  fontSize: '0.74rem',
  fontWeight: 700
};
