/**
 * Page d'authentification professionnelle unifiée (Admin et Livreurs).
 * Redirection automatique selon le rôle du compte connecté.
 */

import React, { useState } from 'react';
import { Lock, ArrowLeft, Bike } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoginForm } from './components/LoginForm';
import { RegisterAdminForm } from './components/RegisterAdminForm';

export const LoginPage = ({ authRole = 'admin', onNavigate, onLoginSuccess }) => {
  const { login, registerAdmin } = useAuth();
  const { showError, showSuccess } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false);

  const isDriverPortal = authRole === 'driver';

  const handleLogin = async ({ identifier, password }) => {
    if (!identifier || !password) {
      return showError('Veuillez renseigner votre identifiant et votre mot de passe.');
    }

    try {
      setIsLoading(true);
      const user = await login(identifier, password);
      showSuccess(`Bienvenue, ${user.firstName} !`);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      showError(err.message || 'Identifiant ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    const { name, email, phone, password, privateKey } = formData;
    if (!name || !email || !phone || !password || !privateKey) {
      return showError('Veuillez renseigner tous les champs obligatoires.');
    }

    try {
      setIsLoading(true);
      const user = await registerAdmin(formData);
      showSuccess(`Compte administrateur créé avec succès ! Bienvenue, ${user.firstName}.`);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      showError(err.message || 'Échec de l\'inscription administrateur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <div style={topNavStyle}>
        <button onClick={() => onNavigate('home')} style={backButtonStyle}>
          <ArrowLeft size={18} /> Retour à l'accueil
        </button>
      </div>

      <div className="card-surface" style={cardStyle}>
        <div style={headerStyle}>
          <div
            style={{
              ...iconBadgeStyle,
              backgroundColor: isDriverPortal
                ? 'var(--color-secondary, #E65100)'
                : 'var(--color-primary)'
            }}
          >
            {isDriverPortal ? (
              <Bike size={24} color="#FFFFFF" />
            ) : (
              <Lock size={22} color="#FFFFFF" />
            )}
          </div>

          <h2 style={titleStyle}>
            {isDriverPortal ? 'Espace Livreur' : 'Espace Administration'}
          </h2>

          <p style={subtitleStyle}>
            {isDriverPortal
              ? 'Portail de connexion réservé exclusivement aux livreurs partenaires.'
              : mode === 'login'
              ? 'Accès sécurisé réservé à la direction et aux administrateurs du restaurant.'
              : 'Création sécurisée d\'un nouveau compte administrateur avec clé privée.'}
          </p>

          {/* Onglets visibles UNIQUEMENT pour les administrateurs (geste secret) */}
          {!isDriverPortal && (
            <div style={tabSwitcherStyle}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={mode === 'login' ? activeTabStyle : inactiveTabStyle}
              >
                Connexion Admin
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                style={mode === 'register' ? activeTabStyle : inactiveTabStyle}
              >
                Créer compte Admin
              </button>
            </div>
          )}
        </div>

        {isDriverPortal || mode === 'login' ? (
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        ) : (
          <RegisterAdminForm onSubmit={handleRegister} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxWidth: '480px',
  margin: '0 auto'
};

const topNavStyle = {
  display: 'flex',
  alignItems: 'center'
};

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.86rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer'
};

const cardStyle = {
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  borderRadius: '16px'
};

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '8px'
};

const iconBadgeStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '14px',
  backgroundColor: 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-primary, 0 4px 14px rgba(230, 81, 0, 0.3))'
};

const titleStyle = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const subtitleStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  maxWidth: '320px',
  lineHeight: 1.4
};

const tabSwitcherStyle = {
  display: 'flex',
  width: '100%',
  backgroundColor: 'var(--bg-card-header, rgba(255, 255, 255, 0.06))',
  borderRadius: '10px',
  padding: '3px',
  marginTop: '8px'
};

const activeTabStyle = {
  flex: 1,
  padding: '8px 10px',
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const inactiveTabStyle = {
  flex: 1,
  padding: '8px 10px',
  backgroundColor: 'transparent',
  color: 'var(--text-secondary)',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.78rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
