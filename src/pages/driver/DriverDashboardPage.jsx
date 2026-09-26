/**
 * Tableau de bord spécialisé pour les livreurs (DriverDashboard).
 * Onglets fluides : Courses en cours, Nouvelles commandes, Historique/Stats et Mon Profil.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Navigation, Bike, History, Package, User } from 'lucide-react';
import { apiClient } from '../../services/api';
import { socket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DriverHeaderCard } from './components/DriverHeaderCard';
import { DriverActiveDeliveryCard } from './components/DriverActiveDeliveryCard';
import { DriverAvailableOrdersList } from './components/DriverAvailableOrdersList';
import { DriverHistorySection } from './components/DriverHistorySection';
import { DriverProfileSection } from './components/DriverProfileSection';

export const DriverDashboardPage = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'available' | 'history' | 'profile'
  const [driverStatus, setDriverStatus] = useState(user?.driverStatus || 'AVAILABLE');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [driverStats, setDriverStats] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/driver/dashboard');
      if (res.success && res.data) {
        setActiveDeliveries(res.data.activeDeliveries || []);
        setAvailableOrders(res.data.availableOrders || []);
        setDriverStats(res.data.stats || null);
      }
    } catch (err) {
      showError(err.message || 'Erreur lors du chargement des courses.');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Synchronisation temps réel Socket.IO pour les livreurs
  useEffect(() => {
    const onOrderReady = () => {
      showInfo('Nouvelle commande prête pour livraison !');
      fetchDashboardData();
    };

    const onOrderTaken = () => {
      fetchDashboardData();
    };

    socket.on('order:ready_for_pickup', onOrderReady);
    socket.on('order:taken', onOrderTaken);

    return () => {
      socket.off('order:ready_for_pickup', onOrderReady);
      socket.off('order:taken', onOrderTaken);
    };
  }, [fetchDashboardData, showInfo]);

  const handleToggleStatus = async (newStatus) => {
    try {
      const res = await apiClient.patch('/driver/status', { status: newStatus });
      if (res.success) {
        setDriverStatus(newStatus);
        showSuccess(`Statut mis à jour : ${newStatus === 'AVAILABLE' ? 'En ligne' : 'Hors ligne'}`);
      }
    } catch (err) {
      showError(err.message || 'Impossible de mettre à jour votre statut.');
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await apiClient.post(`/driver/orders/${orderId}/accept`);
      if (res.success) {
        showSuccess('Course acceptée ! Rendez-vous au restaurant pour récupérer le repas.');
        fetchDashboardData();
        setActiveTab('active');
      }
    } catch (err) {
      showError(err.message || 'Cette commande a déjà été attribuée.');
      fetchDashboardData();
    }
  };

  const handleOrderAction = async (orderId, endpoint, successMsg) => {
    try {
      const res = await apiClient.post(`/driver/orders/${orderId}/${endpoint}`);
      if (res.success) {
        showSuccess(successMsg);
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || 'Erreur lors du changement de statut.');
    }
  };

  const handleOpenNavigation = (coords) => {
    if (coords && coords.length === 2) {
      const [lng, lat] = coords;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* 1. EN-TÊTE DU LIVREUR (masqué sur la vue profil pour ne pas doubler les cartes) */}
      {activeTab !== 'profile' && (
        <DriverHeaderCard
          user={currentUser}
          driverStatus={driverStatus}
          onToggleStatus={handleToggleStatus}
          onOpenProfile={() => setActiveTab('profile')}
          onLogout={logout}
        />
      )}

      {/* 2. ONGLETS DE NAVIGATION LIVREUR */}
      <div style={navTabsStyle}>
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          style={activeTab === 'active' ? activeTabStyle : tabStyle}
        >
          <Navigation size={14} />
          Courses {activeDeliveries.length > 0 ? `(${activeDeliveries.length})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('available')}
          style={activeTab === 'available' ? activeTabStyle : tabStyle}
        >
          <Package size={14} />
          Disponibles {availableOrders.length > 0 ? `(${availableOrders.length})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={activeTab === 'history' ? activeTabStyle : tabStyle}
        >
          <History size={14} />
          Historique
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={activeTab === 'profile' ? activeTabStyle : tabStyle}
        >
          <User size={14} />
          Mon Profil
        </button>
      </div>

      {/* 3. CONTENU SELON L'ONGLET SÉLECTIONNÉ */}
      {activeTab === 'active' && (
        <div style={sectionStyle}>
          {activeDeliveries.length === 0 ? (
            <div className="card-surface" style={emptyStateStyle}>
              <Bike size={36} color="var(--text-muted)" />
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Aucune course active en ce moment.
              </p>
              {availableOrders.length > 0 && (
                <button type="button" onClick={() => setActiveTab('available')} style={ctaLinkStyle}>
                  Voir les {availableOrders.length} commande(s) disponible(s)
                </button>
              )}
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <DriverActiveDeliveryCard
                key={delivery._id}
                delivery={delivery}
                onAction={handleOrderAction}
                onOpenNavigation={handleOpenNavigation}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'available' && (
        <DriverAvailableOrdersList
          orders={availableOrders}
          onAcceptOrder={handleAcceptOrder}
          onRefresh={fetchDashboardData}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'history' && (
        <DriverHistorySection driverStats={driverStats} />
      )}

      {activeTab === 'profile' && (
        <DriverProfileSection
          user={currentUser}
          driverStats={driverStats}
          driverStatus={driverStatus}
          onToggleStatus={handleToggleStatus}
          onBack={() => setActiveTab('active')}
          onProfileUpdated={(updated) => setCurrentUser(updated)}
          onLogout={logout}
        />
      )}
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  paddingBottom: '40px',
  maxWidth: '600px',
  margin: '0 auto'
};

const navTabsStyle = {
  display: 'flex',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '10px',
  padding: '3px',
  gap: '2px'
};

const tabStyle = {
  flex: 1,
  padding: '8px 4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  fontSize: '0.74rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};

const activeTabStyle = {
  ...tabStyle,
  color: '#FFFFFF',
  backgroundColor: 'var(--color-primary)',
  fontWeight: 700
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const emptyStateStyle = {
  padding: '32px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'center',
  borderRadius: '14px'
};

const ctaLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-primary)',
  fontWeight: 700,
  fontSize: '0.82rem',
  cursor: 'pointer',
  textDecoration: 'underline'
};
