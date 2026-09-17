/**
 * Section Gestion du Menu & Catalogue (AdminMenuSection).
 * Affichage des plats par categorie, bascule instantanee de disponibilite et ajout de plats.
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const AdminMenuSection = ({
  dishes = [],
  categories = [],
  onOpenCreateDish,
  onOpenEditDish,
  onToggleAvailability,
  onDeleteDish
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = dishes.filter((d) => {
    const matchesCategory = selectedCategory === 'ALL' || d.categoryId?._id === selectedCategory || d.categoryId === selectedCategory;
    const matchesSearch = !searchQuery.trim() || d.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div style={containerStyle}>
      {/* 1. Barre d'actions & Filtres */}
      <div className="card-surface" style={actionCardStyle}>
        <div style={topActionsRowStyle}>
          <div style={searchWrapStyle}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
            />
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={onOpenCreateDish}>
            Nouveau Plat
          </Button>
        </div>

        {/* Filtres par categorie */}
        <div style={categoryFilterWrapStyle}>
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            style={selectedCategory === 'ALL' ? activeCatStyle : inactiveCatStyle}
          >
            Tous ({dishes.length})
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => setSelectedCategory(c._id)}
              style={selectedCategory === c._id ? activeCatStyle : inactiveCatStyle}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Grille des plats */}
      {filteredDishes.length === 0 ? (
        <div className="card-surface" style={emptyCardStyle}>
          <p style={emptyTextStyle}>Aucun plat trouvé dans cette sélection.</p>
        </div>
      ) : (
        <div style={dishesListStyle}>
          {filteredDishes.map((dish) => (
            <div key={dish._id} className="card-surface" style={dishCardStyle}>
              <div style={dishImageWrapStyle}>
                <img
                  src={dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'}
                  alt={dish.name}
                  style={dishImageStyle}
                />
              </div>

              <div style={dishInfoStyle}>
                <div style={dishTitleRowStyle}>
                  <h4 style={dishNameStyle}>{dish.name}</h4>
                  <strong style={dishPriceStyle}>{formatPrice(dish.price)}</strong>
                </div>

                <p style={dishDescStyle}>{dish.description}</p>

                <div style={dishFooterStyle}>
                  <button
                    type="button"
                    onClick={() => onToggleAvailability(dish._id, !dish.isAvailable)}
                    style={dish.isAvailable ? availableBadgeStyle : unavailableBadgeStyle}
                  >
                    {dish.isAvailable ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>{dish.isAvailable ? 'Disponible' : 'Épuisé'}</span>
                  </button>

                  <div style={dishActionsStyle}>
                    <button
                      type="button"
                      onClick={() => onOpenEditDish(dish)}
                      style={iconBtnStyle}
                      title="Modifier le plat"
                    >
                      <Edit2 size={14} color="var(--color-primary)" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDish(dish._id)}
                      style={iconBtnStyle}
                      title="Supprimer le plat"
                    >
                      <Trash2 size={14} color="var(--status-error)" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const actionCardStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const topActionsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px'
};

const searchWrapStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 10px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '8px',
  border: '1px solid var(--border-color)'
};

const searchInputStyle = {
  border: 'none',
  background: 'transparent',
  width: '100%',
  outline: 'none',
  fontSize: '0.82rem',
  color: 'var(--text-primary)'
};

const categoryFilterWrapStyle = {
  display: 'flex',
  gap: '6px',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  paddingBottom: '2px'
};

const baseCatStyle = {
  padding: '4px 10px',
  borderRadius: '14px',
  fontSize: '0.74rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'all 0.15s ease'
};

const activeCatStyle = {
  ...baseCatStyle,
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF'
};

const inactiveCatStyle = {
  ...baseCatStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-secondary)',
  borderColor: 'var(--border-color)'
};

const dishesListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const dishCardStyle = {
  padding: '12px',
  display: 'flex',
  gap: '12px',
  alignItems: 'center'
};

const dishImageWrapStyle = {
  width: '74px',
  height: '74px',
  borderRadius: '10px',
  overflow: 'hidden',
  flexShrink: 0
};

const dishImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const dishInfoStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const dishTitleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const dishNameStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const dishPriceStyle = {
  fontSize: '0.86rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const dishDescStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-secondary)',
  lineHeight: 1.3,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const dishFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '4px'
};

const badgeBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer'
};

const availableBadgeStyle = {
  ...badgeBaseStyle,
  backgroundColor: 'var(--color-accent-surface)',
  color: 'var(--color-accent-dark)'
};

const unavailableBadgeStyle = {
  ...badgeBaseStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-muted)'
};

const dishActionsStyle = {
  display: 'flex',
  gap: '6px'
};

const iconBtnStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card-header)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const emptyCardStyle = {
  padding: '24px',
  textAlign: 'center'
};

const emptyTextStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-muted)'
};
