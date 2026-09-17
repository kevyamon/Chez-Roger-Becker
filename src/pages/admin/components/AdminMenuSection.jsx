/**
 * Section Gestion du Menu & Catalogue (AdminMenuSection).
 * Affichage des plats, filtres combinés Type & Catégorie, recherche et gestion.
 */

import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { AdminDishCard } from './AdminDishCard';

const TYPE_FILTERS = ['TOUS', 'Nourriture', 'Boisson'];
const CATEGORY_FILTERS = ['TOUTES', 'Normal', 'VIP', 'Spécial'];

export const AdminMenuSection = ({
  dishes = [],
  onOpenCreateDish,
  onOpenEditDish,
  onToggleAvailability,
  onDeleteDish
}) => {
  const [selectedType, setSelectedType] = useState('TOUS');
  const [selectedCategory, setSelectedCategory] = useState('TOUTES');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const dishType = dish.type || 'Nourriture';
      const dishCat = dish.category || dish.categoryId?.name || 'Normal';

      const matchType = selectedType === 'TOUS' || dishType === selectedType;
      const matchCat = selectedCategory === 'TOUTES' || dishCat === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        dish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchCat && matchSearch;
    });
  }, [dishes, selectedType, selectedCategory, searchQuery]);

  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div style={containerStyle}>
      {/* 1. Barre d'actions & Recherche */}
      <div className="card-surface" style={actionCardStyle}>
        <div style={topActionsRowStyle}>
          <div style={searchWrapStyle}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Rechercher un plat, une boisson..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
            />
          </div>
          <Button variant="primary" size="sm" icon={Plus} onClick={onOpenCreateDish}>
            Nouveau Plat
          </Button>
        </div>

        {/* 2. Filtres par Type (Nourriture / Boisson) */}
        <div style={filtersRowStyle}>
          <span style={filterLabelStyle}>Type :</span>
          <div style={filterPillsWrapStyle}>
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                style={selectedType === t ? activeFilterStyle : inactiveFilterStyle}
              >
                {t === 'TOUS' ? 'Tous les types' : t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Filtres par Catégorie (Normal, VIP, Spécial) */}
        <div style={filtersRowStyle}>
          <span style={filterLabelStyle}>Catégorie :</span>
          <div style={filterPillsWrapStyle}>
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                style={selectedCategory === c ? activeFilterStyle : inactiveFilterStyle}
              >
                {c === 'TOUTES' ? 'Toutes les catégories' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Liste des plats filtrés */}
      {filteredDishes.length === 0 ? (
        <div className="card-surface" style={emptyCardStyle}>
          <p style={emptyTextStyle}>Aucun plat ou boisson trouvé avec ces filtres.</p>
        </div>
      ) : (
        <div style={dishesListStyle}>
          {filteredDishes.map((dish) => (
            <AdminDishCard
              key={dish._id}
              dish={dish}
              onToggleAvailability={onToggleAvailability}
              onOpenEditDish={onOpenEditDish}
              onDeleteDish={onDeleteDish}
              formatPrice={formatPrice}
            />
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

const filtersRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const filterLabelStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  minWidth: '60px'
};

const filterPillsWrapStyle = {
  display: 'flex',
  gap: '6px',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  paddingBottom: '2px'
};

const baseFilterStyle = {
  padding: '3px 8px',
  borderRadius: '12px',
  fontSize: '0.72rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'all 0.15s ease'
};

const activeFilterStyle = {
  ...baseFilterStyle,
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF'
};

const inactiveFilterStyle = {
  ...baseFilterStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-secondary)',
  borderColor: 'var(--border-color)'
};

const dishesListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const emptyCardStyle = {
  padding: '24px',
  textAlign: 'center'
};

const emptyTextStyle = {
  fontSize: '0.82rem',
  color: 'var(--text-muted)'
};
