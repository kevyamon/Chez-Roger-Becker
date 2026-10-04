/**
 * Hook dédié aux actions d'archivage et de suppression des commandes admin (useAdminOrderArchive).
 */

import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const useAdminOrderArchive = (setOrders, setDashboardData) => {
  const { showSuccess, showError } = useToast();

  const archiveOrder = async (orderId) => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/archive`);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, isArchived: true } : o)));
        setDashboardData((prev) => prev ? {
          ...prev,
          recentOrders: (prev.recentOrders || []).filter((o) => o._id !== orderId)
        } : prev);
        showSuccess('Commande archivée avec succès.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de l’archivage de la commande.');
      return false;
    }
  };

  const unarchiveOrder = async (orderId) => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/unarchive`);
      if (res.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, isArchived: false } : o)));
        showSuccess('Commande désarchivée.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors du désarchivage.');
      return false;
    }
  };

  const archiveCompletedOrders = async () => {
    try {
      const res = await apiClient.post('/admin/orders/archive-completed');
      if (res.success) {
        setOrders((prev) => prev.map((o) => (['DELIVERED', 'CANCELLED'].includes(o.status) ? { ...o, isArchived: true } : o)));
        setDashboardData((prev) => prev ? {
          ...prev,
          recentOrders: (prev.recentOrders || []).filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status))
        } : prev);
        showSuccess(res.message || 'Toutes les commandes terminées ont été archivées.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de l’archivage groupé.');
      return false;
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await apiClient.delete(`/admin/orders/${orderId}`);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setDashboardData((prev) => prev ? {
          ...prev,
          recentOrders: (prev.recentOrders || []).filter((o) => o._id !== orderId)
        } : prev);
        showSuccess('Commande supprimée définitivement.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de la suppression de la commande.');
      return false;
    }
  };

  return {
    archiveOrder,
    unarchiveOrder,
    archiveCompletedOrders,
    deleteOrder
  };
};
