/**
 * Dictionnaire centralisé des libellés de statuts 100% en Français.
 * Garantit qu'aucun terme technique anglais (PENDING, BUSY, etc.) ne s'affiche côté client.
 */

export const ORDER_STATUS_LABELS = Object.freeze({
  PENDING: 'En attente de validation',
  CONFIRMED: 'Confirmée par le restaurant',
  PREPARING: 'En préparation en cuisine',
  READY_FOR_PICKUP: 'Prête pour livraison',
  ASSIGNED: 'Livreur assigné',
  PICKED_UP: 'Repas récupéré par le livreur',
  OUT_FOR_DELIVERY: 'En cours de livraison chez vous',
  DELIVERED: 'Livrée avec succès',
  CANCELLED: 'Commande annulée'
});

export const DRIVER_STATUS_LABELS = Object.freeze({
  AVAILABLE: 'Disponible (En ligne)',
  BUSY: 'En cours de livraison',
  OFFLINE: 'Hors ligne'
});

export const getOrderStatusLabel = (status) => {
  return ORDER_STATUS_LABELS[status] || status || 'Statut inconnu';
};

export const getDriverStatusLabel = (status) => {
  return DRIVER_STATUS_LABELS[status] || status || 'Inconnu';
};

export const getOrderStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return { bg: 'rgba(234, 179, 8, 0.12)', color: 'var(--status-warning, #EAB308)', border: 'rgba(234, 179, 8, 0.3)' };
    case 'CONFIRMED':
    case 'PREPARING':
      return { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' };
    case 'READY_FOR_PICKUP':
      return { bg: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' };
    case 'ASSIGNED':
    case 'PICKED_UP':
    case 'OUT_FOR_DELIVERY':
      return { bg: 'rgba(249, 115, 22, 0.12)', color: 'var(--color-primary, #E65100)', border: 'rgba(249, 115, 22, 0.3)' };
    case 'DELIVERED':
      return { bg: 'rgba(34, 197, 94, 0.12)', color: 'var(--status-success, #22C55E)', border: 'rgba(34, 197, 94, 0.3)' };
    case 'CANCELLED':
      return { bg: 'rgba(239, 68, 68, 0.12)', color: 'var(--status-error, #EF4444)', border: 'rgba(239, 68, 68, 0.3)' };
    default:
      return { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'var(--border-color)' };
  }
};
