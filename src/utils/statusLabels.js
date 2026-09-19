/**
 * Dictionnaire centralisé des libellés et styles de statut pour Chez Roger Becker.
 * Garantit une traduction française irréprochable et uniforme sur toutes les vues.
 */

export const ORDER_STATUS_LABELS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  READY_FOR_PICKUP: 'Prête en cuisine',
  ASSIGNED: 'Livreur assigné',
  PICKED_UP: 'Récupérée par le livreur',
  OUT_FOR_DELIVERY: 'En cours de livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée'
};

export const PAYMENT_METHOD_LABELS = {
  CASH_ON_DELIVERY: 'Paiement à la livraison',
  ONLINE: 'Paiement en ligne'
};

/**
 * Retourne le libellé français d'un statut technique de commande.
 * @param {string} status - Statut brut backend
 * @returns {string} Libellé en français
 */
export const getOrderStatusLabel = (status) => {
  if (!status) return 'Inconnu';
  return ORDER_STATUS_LABELS[status] || status;
};

/**
 * Retourne le libellé français d'une méthode de paiement.
 * @param {string} method - Méthode brute backend
 * @returns {string} Libellé en français
 */
export const getPaymentMethodLabel = (method) => {
  if (!method) return 'Non spécifié';
  return PAYMENT_METHOD_LABELS[method] || method;
};

/**
 * Retourne le style visuel approprié (couleurs de fond et de texte) pour le badge de statut.
 * @param {string} status - Statut brut backend
 * @returns {object} Propriétés CSS inline
 */
export const getOrderStatusBadgeStyle = (status) => {
  switch (status) {
    case 'DELIVERED':
      return {
        backgroundColor: 'var(--color-accent-surface, rgba(2, 132, 199, 0.15))',
        color: 'var(--color-accent-dark, #0369A1)',
        border: '1px solid var(--color-accent-light, #38BDF8)'
      };
    case 'CANCELLED':
      return {
        backgroundColor: 'rgba(220, 38, 38, 0.12)',
        color: 'var(--status-error, #DC2626)',
        border: '1px solid rgba(220, 38, 38, 0.3)'
      };
    case 'OUT_FOR_DELIVERY':
    case 'PICKED_UP':
    case 'ASSIGNED':
      return {
        backgroundColor: 'var(--color-secondary-surface, rgba(217, 119, 6, 0.15))',
        color: 'var(--color-secondary-dark, #92400E)',
        border: '1px solid var(--color-secondary-light, #FBBF24)'
      };
    case 'CONFIRMED':
    case 'PREPARING':
    case 'READY_FOR_PICKUP':
      return {
        backgroundColor: 'var(--color-primary-surface, rgba(230, 81, 0, 0.15))',
        color: 'var(--color-primary-dark, #BF360C)',
        border: '1px solid var(--color-primary-light, #FF7A00)'
      };
    case 'PENDING':
    default:
      return {
        backgroundColor: 'var(--bg-secondary, #F8FAFC)',
        color: 'var(--text-secondary, #475569)',
        border: '1px solid var(--border-color, #E2E8F0)'
      };
  }
};
