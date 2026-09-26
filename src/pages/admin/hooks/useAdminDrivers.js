/**
 * Hook personnalisé pour la gestion administrative des livreurs (useAdminDrivers).
 */

import { useCallback } from 'react';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const useAdminDrivers = (setDrivers) => {
  const { showSuccess, showError } = useToast();

  const createDriver = useCallback(async (driverData) => {
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
  }, [setDrivers, showSuccess, showError]);

  const updateDriver = useCallback(async (driverId, updateData) => {
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
  }, [setDrivers, showSuccess, showError]);

  const deleteDriver = useCallback(async (driverId) => {
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
  }, [setDrivers, showSuccess, showError]);

  return { createDriver, updateDriver, deleteDriver };
};
