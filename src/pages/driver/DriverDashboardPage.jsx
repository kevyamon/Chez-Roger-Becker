/**
 * Tableau de bord spécialisé pour les livreurs (DriverDashboard).
 * Gestion de disponibilité, acceptation concurrente de courses et guidage d'itinéraire.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DriverHeaderCard } from './components/DriverHeaderCard';
import { DriverActiveDeliveryCard } from './components/DriverActiveDeliveryCard';
import { DriverAvailableOrdersList } from './components/DriverAvailableOrdersList';

export const DriverDashboardPage = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const [driverStatus, setDriverStatus] = useState(user?.driverStatus || 'AVAILABLE');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/driver/dashboard');
      if (res.success && res.data) {
        setActiveDeliveries(res.data.activeDeliveries || []);
        setAvailableOrders(res.data.availableOrders || []);
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
      {/* 1. EN-TÊTE LIVREUR, STATUT & BANNIÈRE NOTIFICATIONS PUSH */}
      <DriverHeaderCard
        user={user}
        driverStatus={driverStatus}
        onToggleStatus={handleToggleStatus}
        onLogout={logout}
      />

      {/* 2. COURSES EN COURS */}
      {activeDeliveries.length > 0 && (
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>Votre Course Active</h4>
          {activeDeliveries.map((delivery) => (
            <DriverActiveDeliveryCard
              key={delivery._id}
              delivery={delivery}
              onAction={handleOrderAction}
              onOpenNavigation={handleOpenNavigation}
            />
          ))}
        </div>
      )}

      {/* 3. COMMANDES DISPONIBLES */}
      <DriverAvailableOrdersList
        orders={availableOrders}
        onAcceptOrder={handleAcceptOrder}
        onRefresh={fetchDashboardData}
        isLoading={isLoading}
      />
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingBottom: '30px'
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const sectionTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};
