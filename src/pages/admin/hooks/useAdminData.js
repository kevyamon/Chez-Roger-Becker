/**
 * Hook personnalisé de gestion et synchronisation des données administratives (useAdminData).
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import { socket, joinAdminRoom } from '../../../services/socket';
import { useToast } from '../../../context/ToastContext';

export const useAdminData = () => {
  const { showSuccess, showError, showInfo } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const fetchAllAdminData = async () => {
    try {
      setIsLoading(true);
      const [dashRes, setRes, ordersRes, dishesRes, catRes, driversRes, auditRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/settings'),
        apiClient.get('/admin/orders'),
        apiClient.get('/admin/dishes'),
        apiClient.get('/admin/categories'),
        apiClient.get('/admin/drivers'),
        apiClient.get('/admin/audit-logs')
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (setRes.success) setSettings(setRes.data?.settings || setRes.data);
      if (ordersRes.success) setOrders(ordersRes.data?.items || ordersRes.data || []);
      if (dishesRes.success) setDishes(dishesRes.data?.items || dishesRes.data || []);
      if (catRes.success) setCategories(catRes.data?.categories || catRes.data || []);
      if (driversRes.success) setDrivers(driversRes.data?.drivers || driversRes.data || []);
      if (auditRes.success) setAuditLogs(auditRes.data?.items || auditRes.data || []);
    } catch (err) {
      showError(err.message || 'Erreur de chargement des données.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
    joinAdminRoom();

    const onOrderCreated = (newOrder) => {
      setOrders((prev) => [newOrder, ...prev.filter((o) => o._id !== newOrder._id)]);
      showInfo(`Nouvelle commande : #${newOrder.orderNumber} (${newOrder.total?.toLocaleString('fr-FR')} FCFA)`);
      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          kpi: {
            ...prev.kpi,
            pendingCount: (prev.kpi?.pendingCount || 0) + 1,
            ordersToday: (prev.kpi?.ordersToday || 0) + 1
          }
        };
      });
    };

    const onOrderUpdated = (updatedOrder) => {
      setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o)));
    };

    const onDriverStatus = ({ driverId, status }) => {
      setDrivers((prev) => prev.map((d) => (d._id === driverId ? { ...d, status } : d)));
    };

    const onSettingsUpdate = (newSettings) => {
      setSettings(newSettings);
    };

    socket.on('order:created', onOrderCreated);
    socket.on('order:updated', onOrderUpdated);
    socket.on('driver:status-changed', onDriverStatus);
    socket.on('restaurant:updated', onSettingsUpdate);

    return () => {
      socket.off('order:created', onOrderCreated);
      socket.off('order:updated', onOrderUpdated);
      socket.off('driver:status-changed', onDriverStatus);
      socket.off('restaurant:updated', onSettingsUpdate);
    };
  }, []);

  const toggleStoreStatus = async () => {
    if (!settings) return;
    try {
      setIsUpdatingStore(true);
      const newStatus = settings.isOpen === false;
      const res = await apiClient.patch('/admin/settings', { isOpen: newStatus });
      if (res.success) {
        setSettings(res.data?.settings || res.data);
        showSuccess(`Le restaurant est désormais ${newStatus ? 'Ouvert aux commandes' : 'Fermé'}.`);
      }
    } catch (err) {
      showError(err.message || 'Échec de mise à jour du statut.');
    } finally {
      setIsUpdatingStore(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        showSuccess(`Statut mis à jour : ${newStatus}`);
        fetchAllAdminData();
      }
    } catch (err) {
      showError(err.message || 'Échec du changement de statut.');
    }
  };

  const saveDish = async (dishData) => {
    try {
      if (dishData._id) {
        await apiClient.patch(`/admin/dishes/${dishData._id}`, dishData);
        showSuccess('Plat mis à jour avec succès.');
      } else {
        await apiClient.post('/admin/dishes', dishData);
        showSuccess('Nouveau plat ajouté au menu.');
      }
      fetchAllAdminData();
    } catch (err) {
      showError(err.message || 'Erreur lors de l\'enregistrement du plat.');
    }
  };

  const toggleDishAvailability = async (dishId, isAvailable) => {
    try {
      await apiClient.patch(`/admin/dishes/${dishId}`, { isAvailable });
      setDishes((prev) => prev.map((d) => (d._id === dishId ? { ...d, isAvailable } : d)));
      showSuccess(`Plat marqué comme ${isAvailable ? 'Disponible' : 'Épuisé'}.`);
    } catch (err) {
      showError(err.message || 'Échec de modification de la disponibilité.');
    }
  };

  const deleteDish = async (dishId) => {
    try {
      await apiClient.delete(`/admin/dishes/${dishId}`);
      setDishes((prev) => prev.filter((d) => d._id !== dishId));
      showSuccess('Plat retiré de la carte avec succès.');
    } catch (err) {
      showError(err.message || 'Erreur lors de la suppression.');
    }
  };

  const createDriver = async (driverData) => {
    try {
      const res = await apiClient.post('/admin/drivers', driverData);
      if (res.success && res.data?.driver) {
        setDrivers((prev) => [res.data.driver, ...prev]);
        showSuccess('Compte livreur créé avec succès.');
      }
    } catch (err) {
      showError(err.message || 'Échec de création du livreur.');
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const res = await apiClient.patch('/admin/settings', newSettings);
      if (res.success) {
        setSettings(res.data?.settings || res.data);
        showSuccess('Paramètres du restaurant mis à jour.');
      }
    } catch (err) {
      showError(err.message || 'Erreur lors de la sauvegarde des paramètres.');
    }
  };

  return {
    isLoading,
    isUpdatingStore,
    dashboardData,
    settings,
    orders,
    dishes,
    categories,
    drivers,
    auditLogs,
    toggleStoreStatus,
    updateOrderStatus,
    saveDish,
    toggleDishAvailability,
    deleteDish,
    createDriver,
    saveSettings
  };
};
