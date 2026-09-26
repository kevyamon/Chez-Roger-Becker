/**
 * Section de gestion des offres et bannières promotionnelles (AdminPromotionsSection).
 * Permet d'ajouter, modifier, activer/désactiver et supprimer des offres en temps réel.
 */

import React, { useState } from 'react';
import { Plus, Tag, BadgePercent } from 'lucide-react';
import { AdminPromotionCard } from './AdminPromotionCard';
import { PromotionEditModal } from './PromotionEditModal';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';

export const AdminPromotionsSection = ({
  promotions = [],
  dishes = [],
  isLoading = false,
  onSavePromotion,
  onToggleStatus,
  onDeletePromotion
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  return (
    <div style={sectionContainerStyle}>
      {/* 1. En-tête de section */}
      <div className="card-surface" style={headerCardStyle}>
        <div style={headerInfoStyle}>
          <div style={iconBadgeStyle}>
            <Tag size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 style={sectionTitleStyle}>Offres & Promotions</h3>
            <p style={sectionSubtitleStyle}>
              {promotions.length} offre{promotions.length > 1 ? 's' : ''} enregistrée{promotions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Ajouter une offre
        </Button>
      </div>

      {/* 2. Liste des offres ou skeletons */}
      {isLoading ? (
        <div style={promosGridStyle}>
          {[1, 2].map((idx) => (
            <div key={idx} className="card-surface" style={{ padding: '16px', borderRadius: '14px' }}>
              <Skeleton width="100%" height="130px" borderRadius="10px" />
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton width="60%" height="16px" />
                <Skeleton width="90%" height="12px" />
                <Skeleton width="40%" height="12px" />
              </div>
            </div>
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <div className="card-surface" style={emptyStateCardStyle}>
          <div style={emptyIconCircleStyle}>
            <BadgePercent size={28} color="var(--color-primary)" />
          </div>
          <h4 style={emptyTitleStyle}>Aucune offre promotionnelle</h4>
          <p style={emptyDescStyle}>
            Créez votre première annonce ou bannière pour attirer plus de clients sur la page d'accueil.
          </p>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
            style={{ marginTop: '6px' }}
          >
            Créer ma première offre
          </Button>
        </div>
      ) : (
        <div style={promosGridStyle}>
          {promotions.map((promo) => (
            <AdminPromotionCard
              key={promo._id}
              promotion={promo}
              onEdit={handleOpenEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDeletePromotion}
            />
          ))}
        </div>
      )}

      {/* 3. Modale d'ajout / modification */}
      <PromotionEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        promotion={editingPromo}
        dishes={dishes}
        onSavePromotion={onSavePromotion}
      />
    </div>
  );
};

const sectionContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const headerCardStyle = {
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap'
};

const headerInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const iconBadgeStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const sectionTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const sectionSubtitleStyle = {
  fontSize: '0.78rem',
  color: 'var(--text-secondary)'
};

const promosGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const emptyStateCardStyle = {
  padding: '36px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '14px'
};

const emptyIconCircleStyle = {
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-primary-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '4px'
};

const emptyTitleStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const emptyDescStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-secondary)',
  maxWidth: '320px',
  lineHeight: 1.4
};
