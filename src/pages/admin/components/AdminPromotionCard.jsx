/**
 * Carte d'affichage d'une offre promotionnelle pour l'administration (AdminPromotionCard).
 * Présentation visuelle soignée, statut en direct et actions rapides.
 */

import React, { useState } from 'react';
import { Edit2, Trash2, Link2, Utensils, Power, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { theme } from '../../../styles/theme';

export const AdminPromotionCard = ({
  promotion,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const hasImage = Boolean(promotion.image && promotion.image.trim());
  const linkedDish = promotion.dishId;
  const linkedDishName = typeof linkedDish === 'object' ? linkedDish?.name : null;

  return (
    <div className="card-surface" style={cardContainerStyle}>
      {/* 1. Bannière de l'offre ou carte graphique élégante */}
      <div style={bannerContainerStyle}>
        {hasImage ? (
          <img src={promotion.image} alt={promotion.title} style={bannerImageStyle} />
        ) : (
          <div style={gradientBannerFallbackStyle}>
            <Tag size={28} color="var(--color-primary)" />
            <span style={fallbackTagTextStyle}>Offre Spéciale</span>
          </div>
        )}

        <div style={statusBadgeOverlayStyle}>
          <span
            style={{
              ...statusBadgeStyle,
              backgroundColor: promotion.isActive
                ? 'var(--status-success, #16A34A)'
                : 'var(--text-muted, #94A3B8)'
            }}
          >
            {promotion.isActive ? 'Active' : 'Désactivée'}
          </span>
        </div>
      </div>

      {/* 2. Contenu textuel */}
      <div style={bodyContentStyle}>
        <h4 style={titleStyle}>{promotion.title}</h4>
        {promotion.description && (
          <p style={descStyle}>{promotion.description}</p>
        )}

        {/* Cible / Redirection */}
        <div style={targetRowStyle}>
          {linkedDishName ? (
            <span style={targetBadgeStyle}>
              <Utensils size={13} color="var(--color-primary)" />
              <span>Plat lié : <strong>{linkedDishName}</strong></span>
            </span>
          ) : promotion.link ? (
            <span style={targetBadgeStyle}>
              <Link2 size={13} color="var(--color-accent)" />
              <span style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Lien : <strong>{promotion.link}</strong>
              </span>
            </span>
          ) : (
            <span style={{ ...targetBadgeStyle, color: 'var(--text-muted)' }}>
              Annonce d'accueil
            </span>
          )}
        </div>
      </div>

      {/* 3. Barre d'actions */}
      <div style={actionsRowStyle}>
        <button
          type="button"
          onClick={() => onToggleStatus(promotion._id, promotion.isActive)}
          style={{
            ...actionToggleBtnStyle,
            color: promotion.isActive ? 'var(--status-success)' : 'var(--text-muted)'
          }}
          title={promotion.isActive ? 'Désactiver l\'offre' : 'Activer l\'offre'}
        >
          <Power size={16} />
          <span>{promotion.isActive ? 'En ligne' : 'Masquée'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            icon={Edit2}
            onClick={() => onEdit(promotion)}
          >
            Modifier
          </Button>

          {isConfirmingDelete ? (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => onDelete(promotion._id)}
                style={confirmDeleteBtnStyle}
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                style={cancelDeleteBtnStyle}
              >
                Non
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              style={deleteIconBtnStyle}
              title="Supprimer l'offre"
            >
              <Trash2 size={16} color="var(--status-error)" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const cardContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '14px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
};

const bannerContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '140px',
  backgroundColor: 'var(--bg-card-header)',
  overflow: 'hidden'
};

const bannerImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
};

const gradientBannerFallbackStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  background: 'linear-gradient(135deg, var(--color-primary-surface) 0%, var(--color-secondary-surface) 100%)'
};

const fallbackTagTextStyle = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: 'var(--color-primary-dark)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statusBadgeOverlayStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px'
};

const statusBadgeStyle = {
  fontSize: '0.7rem',
  fontWeight: 800,
  color: '#FFFFFF',
  padding: '3px 8px',
  borderRadius: '6px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

const bodyContentStyle = {
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  flex: 1
};

const titleStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
  lineHeight: 1.3
};

const descStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const targetRowStyle = {
  marginTop: '6px',
  display: 'flex',
  alignItems: 'center'
};

const targetBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.76rem',
  color: 'var(--text-primary)',
  backgroundColor: 'var(--bg-card-header)',
  padding: '4px 8px',
  borderRadius: '6px',
  border: '1px solid var(--border-color)'
};

const actionsRowStyle = {
  padding: '10px 16px',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--bg-card-header)'
};

const actionToggleBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.78rem',
  fontWeight: 700,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px 6px',
  borderRadius: '6px'
};

const deleteIconBtnStyle = {
  background: 'none',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '7px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const confirmDeleteBtnStyle = {
  backgroundColor: 'var(--status-error)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '0.72rem',
  fontWeight: 800,
  cursor: 'pointer'
};

const cancelDeleteBtnStyle = {
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  padding: '6px 8px',
  fontSize: '0.72rem',
  cursor: 'pointer'
};
