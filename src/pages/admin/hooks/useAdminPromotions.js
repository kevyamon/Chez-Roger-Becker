/**
 * Hook personnalisé pour la gestion des offres et promotions (useAdminPromotions).
 * Orchestration CRUD et écoute temps réel Socket.IO.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';
import { socket } from '../../../services/socket';
import { useToast } from '../../../context/ToastContext';

export const useAdminPromotions = () => {
  const { showSuccess, showError } = useToast();
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromotions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/admin/promotions?limit=50');
      if (res.success && res.data) {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.items)
          ? res.data.items
          : Array.isArray(res.data.promotions)
          ? res.data.promotions
          : [];
        setPromotions(list);
      }
    } catch (err) {
      showError(err.message || 'Impossible de charger les offres promotionnelles.');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchPromotions();

    const onPromoCreated = (newPromo) => {
      if (!newPromo?._id) return;
      setPromotions((prev) => [newPromo, ...prev.filter((p) => p._id !== newPromo._id)]);
    };

    const onPromoUpdated = (updPromo) => {
      if (!updPromo?._id) return;
      setPromotions((prev) =>
        prev.map((p) => (p._id === updPromo._id ? { ...p, ...updPromo } : p))
      );
    };

    const onPromoDeleted = ({ promoId }) => {
      if (!promoId) return;
      setPromotions((prev) => prev.filter((p) => p._id !== promoId));
    };

    socket.on('promotion:created', onPromoCreated);
    socket.on('promotion:updated', onPromoUpdated);
    socket.on('promotion:deleted', onPromoDeleted);

    return () => {
      socket.off('promotion:created', onPromoCreated);
      socket.off('promotion:updated', onPromoUpdated);
      socket.off('promotion:deleted', onPromoDeleted);
    };
  }, [fetchPromotions]);

  const savePromotion = async (promoData) => {
    try {
      if (promoData._id) {
        const res = await apiClient.patch(`/admin/promotions/${promoData._id}`, promoData);
        if (res.success && (res.data?.promo || res.data)) {
          const updated = res.data.promo || res.data;
          setPromotions((prev) =>
            prev.map((p) => (p._id === promoData._id ? { ...p, ...updated } : p))
          );
          showSuccess('Offre promotionnelle mise à jour avec succès.');
          return true;
        }
      } else {
        const res = await apiClient.post('/admin/promotions', promoData);
        if (res.success && (res.data?.promo || res.data)) {
          const created = res.data.promo || res.data;
          setPromotions((prev) => [created, ...prev.filter((p) => p._id !== created._id)]);
          showSuccess('Nouvelle offre promotionnelle publiée avec succès.');
          return true;
        }
      }
      return false;
    } catch (err) {
      showError(err.message || "Erreur lors de l'enregistrement de l'offre.");
      return false;
    }
  };

  const togglePromotionStatus = async (promoId, currentStatus) => {
    try {
      const res = await apiClient.patch(`/admin/promotions/${promoId}`, {
        isActive: !currentStatus
      });
      if (res.success) {
        setPromotions((prev) =>
          prev.map((p) => (p._id === promoId ? { ...p, isActive: !currentStatus } : p))
        );
        showSuccess(`Offre ${!currentStatus ? 'activée' : 'désactivée'} avec succès.`);
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Impossible de modifier le statut de l\'offre.');
      return false;
    }
  };

  const deletePromotion = async (promoId) => {
    try {
      const res = await apiClient.delete(`/admin/promotions/${promoId}`);
      if (res.success) {
        setPromotions((prev) => prev.filter((p) => p._id !== promoId));
        showSuccess('Offre promotionnelle supprimée avec succès.');
        return true;
      }
      return false;
    } catch (err) {
      showError(err.message || 'Erreur lors de la suppression de l\'offre.');
      return false;
    }
  };

  return {
    promotions,
    isLoading,
    fetchPromotions,
    savePromotion,
    togglePromotionStatus,
    deletePromotion
  };
};
