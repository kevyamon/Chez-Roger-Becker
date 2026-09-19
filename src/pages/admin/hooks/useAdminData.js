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

  const fetchAllAdminData = async () => {
    try {
      setIsLoading(true);
      const [dashRes, setRes, ordersRes, dishesRes, catRes, driversRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/settings'),
        apiClient.get('/admin/orders'),
        apiClient.get('/admin/dishes'),
        apiClient.get('/admin/categories'),
        apiClient.get('/admin/drivers')
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (setRes.success) setSettings(setRes.data?.settings || setRes.data);
      if (ordersRes.success) setOrders(ordersRes.data?.items || ordersRes.data || []);
      if (dishesRes.success) setDishes(dishesRes.data?.items || dishesRes.data || []);
      if (catRes.success) setCategories(catRes.data?.categories || catRes.data || []);
      if (driversRes.success) setDrivers(driversRes.data?.drivers || driversRes.data || []);
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
            todayRevenue: (prev.kpi?.todayRevenue || 0) + (newOrder.total || 0)
          }
        };
      });
    };

    const onOrderStatusChanged = (updated) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === updated.orderId || o.orderNumber === updated.orderNumber
            ? { ...o, status: updated.status, statusHistory: updated.statusHistory || o.statusHistory }
            : o
        )
      );
    };

    const onRestaurantUpdated = (upd) => {
      setSettings((prev) => (prev ? { ...prev, ...upd } : upd));
    };

    socket.on('order:created', onOrderCreated);
    socket.on('order:status-changed', onOrderStatusChanged);
    socket.on('restaurant:updated', onRestaurantUpdated);

    return () => {
      socket.off('order:created', onOrderCreated);
      socket.off('order:status-changed', onOrderStatusChanged);
      socket.off('restaurant:updated', onRestaurantUpdated);
    };
  }, []);

  const toggleStoreStatus = async () => {
    try {
      setIsUpdatingStore(true);
      const newStatus = !settings?.isOpen;
      const res = await apiClient.patch('/admin/restaurant/toggle-status', { isOpen: newStatus });
      if (res.success) {
        setSettings((prev) => ({ ...prev, isOpen: newStatus }));
        showSuccess(`Restaurant ${newStatus ? 'ouvert' : 'fermé'} avec succès.`);
      }
    } catch (err) {
      showError(err.message || 'Impossible de modifier le statut du restaurant.');
    } finally {
      setIsUpdatingStore(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus, note });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        showSuccess(`Statut mis à jour : ${newStatus}`);
      }
    } catch (err) {
      showError(err.message || 'Échec de mise à jour du statut.');
    }
  };

  const saveDish = async (dishData) => {
    try {
      if (dishData._id) {
        const res = await apiClient.put(`/admin/dishes/${dishData._id}`, dishData);
        if (res.success && res.data?.dish) {
          setDishes((prev) => prev.map((d) => (d._id === dishData._id ? res.data.dish : d)));
          showSuccess('Plat mis à jour avec succès.');
          return true;
        }
      } else {
        const res = await apiClient.post('/admin/dishes', dishData);
        if (res.success && res.data?.dish) {
          setDishes((prev) => [res.data.dish, ...prev]);
          showSuccess('Nouveau plat ajouté à la carte.');
          return true;
        }
      }
      return false;
    } catch (err) {
      showError(err.message || 'Échec lors de l\'enregistrement du plat.');
      return false;
    }
  };

  const toggleDishAvailability = async (dishId, currentAvailability) => {
    try {
      const res = await apiClient.patch(`/admin/dishes/${dishId}/availability`, { isAvailable: !currentAvailability });
      if (res.success) {
        setDishes((prev) =>
          prev.map((d) => (d._id === dishId ? { ...d, isAvailable: !currentAvailability } : d))
        );
        showSuccess(`Plat ${!currentAvailability ? 'marqué comme disponible' : 'marqué comme épuisé'}.`);
      }
    } catch (err) {
      showError(err.message || 'Échec du changement de statut.');
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

  const updateDriver = async (driverId, updateData) => {
    try {
      const res = await apiClient.patch(`/admin/drivers/${driverId}`, updateData);
      if (res.success && res.data?.driver) {
        setDrivers((prev) => prev.map((d) => (d._id === driverId ? res.data.driver : d)));
        showSuccess('Compte livreur mis à jour avec succès.');
      }
    } catch (err) {
      showError(err.message || 'Échec de mise à jour du livreur.');
    }
  };

  const deleteDriver = async (driverId) => {
    try {
      const res = await apiClient.delete(`/admin/drivers/${driverId}`);
      if (res.success) {
        setDrivers((prev) => prev.filter((d) => d._id !== driverId));
        showSuccess('Livreur supprimé avec succès.');
      }
    } catch (err) {
      showError(err.message || 'Échec de suppression du livreur.');
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
    toggleStoreStatus,
    updateOrderStatus,
    saveDish,
    toggleDishAvailability,
    deleteDish,
    createDriver,
    updateDriver,
    deleteDriver,
    saveSettings
  };
};
