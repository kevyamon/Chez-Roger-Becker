/**
 * Section Profil Livreur (DriverProfileSection).
 * Véritable page de gestion complète du compte livreur : identité, coordonnées, sécurité et statut.
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Lock,
  LogOut,
  ShieldCheck,
  PackageCheck,
  Banknote,
  Bike
} from 'lucide-react';
import { DriverProfileDetailsForm } from './DriverProfileDetailsForm';
import { DriverSecurityForm } from './DriverSecurityForm';
import { NotificationPermissionBanner } from '../../../components/ui/NotificationPermissionBanner';
import { Button } from '../../../components/ui/Button';

export const DriverProfileSection = ({
  user,
  driverStats,
  driverStatus,
  onToggleStatus,
  onBack,
  onProfileUpdated,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'security'

  const initials = `${user?.firstName?.[0] || 'L'}${user?.lastName?.[0] || 'P'}`.toUpperCase();

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* 1. BARRE DE RETOUR SUPÉRIEURE */}
      <div style={topNavStyle}>
        <button type="button" onClick={onBack} style={backButtonStyle}>
          <ArrowLeft size={18} />
          <span>Retour aux courses</span>
        </button>
        <span style={topTitleStyle}>Mon Profil Livreur</span>
      </div>

      {/* 2. CARTE D'IDENTITÉ & STATUT */}
      <div className="card-surface" style={identityCardStyle}>
        <div style={identityHeaderStyle}>
          <div style={avatarStyle}>
            <span style={avatarTextStyle}>{initials}</span>
          </div>

          <div style={identityInfoStyle}>
            <div style={nameBadgeRowStyle}>
              <h3 style={driverNameStyle}>
                {user?.firstName} {user?.lastName}
              </h3>
            </div>
            <div style={badgeRowStyle}>
              <span style={officialBadgeStyle}>
                <ShieldCheck size={13} /> Livreur Partenaire Agréé
              </span>
            </div>
            <span style={contactTextStyle}>{user?.phone} • {user?.email}</span>
          </div>
        </div>

        {/* Bouton de statut en direct */}
        <div style={statusToggleRowStyle}>
          <span style={statusLabelStyle}>Disponibilité opérationnelle :</span>
          <div style={statusBtnGroupStyle}>
            <button
              type="button"
              onClick={() => onToggleStatus('AVAILABLE')}
              style={{
                ...statusBtnStyle,
                backgroundColor: driverStatus === 'AVAILABLE' ? 'var(--status-success)' : 'var(--bg-elevated)',
                color: driverStatus === 'AVAILABLE' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              En ligne
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus('OFFLINE')}
              style={{
                ...statusBtnStyle,
                backgroundColor: driverStatus === 'OFFLINE' ? 'var(--text-muted)' : 'var(--bg-elevated)',
                color: driverStatus === 'OFFLINE' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              Hors ligne
            </button>
          </div>
        </div>
      </div>

      {/* 3. CARTES STATISTIQUES RÉCAPITULATIVES */}
      <div style={kpiGridStyle}>
        <div className="card-surface" style={kpiCardStyle}>
          <div style={kpiIconStyle}>
            <PackageCheck size={18} color="var(--color-primary)" />
          </div>
          <div>
            <span style={kpiLabelStyle}>Livraisons Aujourd'hui</span>
            <strong style={kpiValueStyle}>{driverStats?.todayDeliveries || 0}</strong>
          </div>
        </div>

        <div className="card-surface" style={kpiCardStyle}>
          <div style={kpiIconStyle}>
            <Banknote size={18} color="var(--status-success)" />
          </div>
          <div>
            <span style={kpiLabelStyle}>Total Cash Encaissé</span>
            <strong style={kpiValueStyle}>
              {(driverStats?.totalCashCollected || 0).toLocaleString('fr-FR')} F
            </strong>
          </div>
        </div>
      </div>

      {/* 4. ONGLETS DE PARAMÉTRAGE */}
      <div style={tabsNavStyle}>
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          style={activeTab === 'info' ? tabBtnActiveStyle : tabBtnStyle}
        >
          <User size={15} />
          <span>Coordonnées</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={activeTab === 'security' ? tabBtnActiveStyle : tabBtnStyle}
        >
          <Lock size={15} />
          <span>Sécurité & Mot de passe</span>
        </button>
      </div>

      {/* 5. FORMULAIRE DU SOUS-MODULE SÉLECTIONNÉ */}
      <div className="card-surface" style={formCardStyle}>
        {activeTab === 'info' ? (
          <DriverProfileDetailsForm user={user} onProfileUpdated={onProfileUpdated} />
        ) : (
          <DriverSecurityForm />
        )}
      </div>

      {/* 6. BANNIÈRE DE NOTIFICATIONS PUSH */}
      <NotificationPermissionBanner role="DRIVER" />

      {/* 7. DÉCONNEXION DU COMPTE */}
      <div className="card-surface" style={logoutCardStyle}>
        <div style={logoutHeaderStyle}>
          <div>
            <h4 style={logoutTitleStyle}>Session de service</h4>
            <p style={logoutSubtitleStyle}>
              Déconnectez-vous en fin de vacation ou pour changer d'appareil.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="md"
          fullWidth
          icon={LogOut}
          onClick={onLogout}
          style={logoutButtonStyle}
        >
          Se déconnecter de mon compte livreur
        </Button>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', paddingBottom: '30px' };
const topNavStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' };
const backButtonStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' };
const topTitleStyle = { fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-secondary)' };
const identityCardStyle = { padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '16px' };
const identityHeaderStyle = { display: 'flex', alignItems: 'center', gap: '14px' };
const avatarStyle = { width: '54px', height: '54px', borderRadius: '16px', backgroundColor: 'var(--color-primary-surface)', border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const avatarTextStyle = { fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' };
const identityInfoStyle = { display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 };
const nameBadgeRowStyle = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' };
const driverNameStyle = { fontSize: '1.10rem', fontWeight: 800, color: 'var(--text-primary)' };
const badgeRowStyle = { display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0' };
const officialBadgeStyle = { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.70rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'var(--color-secondary-surface)', color: 'var(--color-secondary-dark)' };
const contactTextStyle = { fontSize: '0.76rem', color: 'var(--text-secondary)', wordBreak: 'break-word' };
const statusToggleRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' };
const statusLabelStyle = { fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)' };
const statusBtnGroupStyle = { display: 'flex', gap: '6px' };
const statusBtnStyle = { padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s ease, color 0.2s ease' };
const kpiGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const kpiCardStyle = { padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px' };
const kpiIconStyle = { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const kpiLabelStyle = { display: 'block', fontSize: '0.70rem', color: 'var(--text-secondary)' };
const kpiValueStyle = { fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' };
const tabsNavStyle = { display: 'flex', backgroundColor: 'var(--bg-card-header)', borderRadius: '12px', padding: '4px', gap: '4px' };
const tabBtnStyle = { flex: 1, padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const tabBtnActiveStyle = { ...tabBtnStyle, color: '#FFFFFF', backgroundColor: 'var(--color-primary)', fontWeight: 700 };
const formCardStyle = { padding: '18px', borderRadius: '16px' };
const logoutCardStyle = { padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' };
const logoutHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const logoutTitleStyle = { fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' };
const logoutSubtitleStyle = { fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' };
const logoutButtonStyle = { borderColor: 'var(--status-error)', color: 'var(--status-error)', backgroundColor: 'transparent' };
