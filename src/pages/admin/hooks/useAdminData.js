/**
 * Hook personnalisé de synchronisation des données administratives (useAdminData).
 * Chargement résilient via Promise.allSettled et écoute en temps réel Socket.IO.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';
import { socket, joinAdminRoom } from '../../../services/socket';
import { useToast } from '../../../context/ToastContext';

export const useAdminData = () => {
  const { showSuccess, showError, showInfo } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const fetchAllAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await Promise.allSettled([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/settings'),
        apiClient.get('/admin/orders'),
        apiClient.get('/admin/dishes'),
        apiClient.get('/admin/categories'),
        apiClient.get('/admin/drivers')
      ]);

      const [dashRes, setRes, ordersRes, dishesRes, catRes, driversRes] = results;

      if (dashRes.status === 'fulfilled' && dashRes.value?.success) setDashboardData(dashRes.value.data);
      if (setRes.status === 'fulfilled' && setRes.value?.success) setSettings(setRes.value.data?.settings || setRes.value.data);
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) setOrders(ordersRes.value.data?.items || ordersRes.value.data || []);
      if (dishesRes.status === 'fulfilled' && dishesRes.value?.success) setDishes(dishesRes.value.data?.items || dishesRes.value.data || []);
      if (catRes.status === 'fulfilled' && catRes.value?.success) setCategories(catRes.value.data?.categories || catRes.value.data || []);
      if (driversRes.status === 'fulfilled' && driversRes.value?.success) {
        const dData = driversRes.value.data;
        const dList = Array.isArray(dData?.drivers) ? dData.drivers : Array.isArray(dData) ? dData : [];
        setDrivers(dList);
      }
    } catch (err) {
      showError(err.message || 'Erreur lors de la synchronisation des données.');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAllAdminData();
    joinAdminRoom();

    const onOrderCreated = (newOrder) => {
      if (!newOrder?._id) return;
      setOrders((prev) => [newOrder, ...prev.filter((o) => o._id !== newOrder._id)]);
      showInfo(`Nouvelle commande : #${newOrder.orderNumber}`);
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

    const onOrderStatusChanged = (upd) => {
      setOrders((prev) => prev.map((o) => (o._id === upd.orderId || o.orderNumber === upd.orderNumber ? { ...o, ...upd } : o)));
    };

    const onRestaurantUpdated = (upd) => setSettings((prev) => (prev ? { ...prev, ...upd } : upd));
    const onDriverCreated = (d) => d?._id && setDrivers((prev) => [d, ...prev.filter((item) => item._id !== d._id)]);
    const onDriverUpdated = (d) => d?._id && setDrivers((prev) => prev.map((item) => (item._id === d._id ? { ...item, ...d } : item)));
    const onDriverStatusChanged = ({ driverId, status }) => driverId && setDrivers((prev) => prev.map((d) => (d._id === driverId ? { ...d, driverStatus: status } : d)));
    const onDriverDeleted = ({ driverId }) => driverId && setDrivers((prev) => prev.filter((d) => d._id !== driverId));

    socket.on('order:created', onOrderCreated);
    socket.on('order:status-changed', onOrderStatusChanged);
    socket.on('restaurant:updated', onRestaurantUpdated);
    socket.on('driver:created', onDriverCreated);
    socket.on('driver:updated', onDriverUpdated);
    socket.on('driver:status-changed', onDriverStatusChanged);
    socket.on('driver:deleted', onDriverDeleted);

    return () => {
      socket.off('order:created', onOrderCreated);
      socket.off('order:status-changed', onOrderStatusChanged);
      socket.off('restaurant:updated', onRestaurantUpdated);
      socket.off('driver:created', onDriverCreated);
      socket.off('driver:updated', onDriverUpdated);
      socket.off('driver:status-changed', onDriverStatusChanged);
      socket.off('driver:deleted', onDriverDeleted);
    };
  }, [fetchAllAdminData, showInfo]);

  const toggleStoreStatus = async () => {
    try {
      setIsUpdatingStore(true);
      const isCurrentlyOpen = settings?.isEffectivelyOpen !== undefined
        ? Boolean(settings.isEffectivelyOpen)
        : Boolean(settings?.isOpen !== false);
      const newStatus = !isCurrentlyOpen;
      const res = await apiClient.patch('/admin/settings', { isOpen: newStatus });
      if (res.success && (res.data?.settings || res.data)) {
        const updated = res.data.settings || res.data;
        setSettings((prev) => ({ ...prev, ...updated }));
        showSuccess(`Restaurant ${updated.isEffectivelyOpen !== undefined ? (updated.isEffectivelyOpen ? 'ouvert' : 'fermé') : (newStatus ? 'ouvert' : 'fermé')} avec succès.`);
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
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
        showSuccess(`Statut mis à jour : ${newStatus}`);
      }
    } catch (err) {
      showError(err.message || 'Échec de mise à jour du statut.');
    }
  };

  const saveDish = async (dishData) => {
    try {
      if (dishData._id) {
        const res = await apiClient.patch(`/admin/dishes/${dishData._id}`, dishData);
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
      showError(err.message || "Échec lors de l'enregistrement du plat.");
      return false;
    }
  };

  const toggleDishAvailability = async (dishId, currentAvailability) => {
    try {
      const res = await apiClient.patch(`/admin/dishes/${dishId}/availability`, { isAvailable: !currentAvailability });
      if (res.success) {
        setDishes((prev) => prev.map((d) => (d._id === dishId ? { ...d, isAvailable: !currentAvailability } : d)));
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
        setDrivers((prev) => [res.data.driver, ...prev.filter((d) => d._id !== res.data.driver._id)]);
        showSuccess('Compte livreur créé avec succès.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Échec de création du livreur.');
      return false;
    }
  };

  const updateDriver = async (driverId, updateData) => {
    try {
      const res = await apiClient.patch(`/admin/drivers/${driverId}`, updateData);
      if (res.success && res.data?.driver) {
        setDrivers((prev) => prev.map((d) => (d._id === driverId ? { ...d, ...res.data.driver } : d)));
        showSuccess('Compte livreur mis à jour avec succès.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Échec de mise à jour du livreur.');
      return false;
    }
  };

  const deleteDriver = async (driverId) => {
    try {
      const res = await apiClient.delete(`/admin/drivers/${driverId}`);
      if (res.success) {
        setDrivers((prev) => prev.filter((d) => d._id !== driverId));
        showSuccess('Livreur supprimé avec succès.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Échec de suppression du livreur.');
      return false;
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const res = await apiClient.patch('/admin/settings', newSettings);
      if (res.success) {
        setSettings(res.data?.settings || res.data);
        showSuccess('Paramètres du restaurant mis à jour.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de la sauvegarde des paramètres.');
      return false;
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
    fetchAllAdminData,
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
