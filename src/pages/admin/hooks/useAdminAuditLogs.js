/**
 * Hook dédié à la gestion et purge du journal d'audit administrateur (useAdminAuditLogs).
 */

import { useState, useCallback } from 'react';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const useAdminAuditLogs = () => {
  const { showSuccess, showError } = useToast();
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  const fetchAuditLogs = useCallback(async () => {
    try {
      setIsLoadingAudit(true);
      const res = await apiClient.get('/admin/audit-logs');
      if (res.success && res.data) {
        const rawLogs = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.items)
            ? res.data.items
            : (Array.isArray(res.data?.logs) ? res.data.logs : []));
        setAuditLogs(rawLogs);
      }
    } catch (err) {
      console.warn('Erreur chargement logs audit :', err.message);
    } finally {
      setIsLoadingAudit(false);
    }
  }, []);

  const deleteAuditLog = async (logId) => {
    try {
      const res = await apiClient.delete(`/admin/audit-logs/${logId}`);
      if (res.success) {
        setAuditLogs((prev) => prev.filter((l) => l._id !== logId));
        showSuccess('Entrée d’audit supprimée.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de la suppression du log.');
      return false;
    }
  };

  const clearAuditLogs = async () => {
    try {
      const res = await apiClient.delete('/admin/audit-logs');
      if (res.success) {
        setAuditLogs([]);
        showSuccess('Journal d’audit purgé avec succès.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de la purge du journal d’audit.');
      return false;
    }
  };

  return {
    auditLogs,
    isLoadingAudit,
    fetchAuditLogs,
    deleteAuditLog,
    clearAuditLogs
  };
};
