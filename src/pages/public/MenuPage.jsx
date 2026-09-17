/**
 * Page de la carte complète du menu (/menu).
 * Comprend la recherche instantanée, le filtrage par type (Nourriture/Boisson), par catégorie et l'ajout au panier.
 */

import React, { useState, useMemo } from 'react';
import { Search, UtensilsCrossed, Utensils, GlassWater } from 'lucide-react';
import { CategoryFilter } from '../../components/menu/CategoryFilter';
import { DishCard } from '../../components/menu/DishCard';

const TYPE_OPTIONS = [
  { id: 'ALL', label: 'Tout le menu', icon: null },
  { id: 'Nourriture', label: 'Nourriture', icon: Utensils },
  { id: 'Boisson', label: 'Boissons', icon: GlassWater }
];

const DEFAULT_CATEGORIES = ['Normal', 'VIP', 'Spécial'];

export const MenuPage = ({ dishes = [], categories = [], onSelectDish }) => {
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Utiliser les catégories fournies ou la liste standard par défaut
  const activeCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const dishType = dish.type || 'Nourriture';
      const dishCat = dish.category || dish.categoryId?.name || dish.categoryId;

      const matchType = selectedType === 'ALL' || dishType === selectedType;
      const matchCategory = !selectedCategory || dishCat === selectedCategory || dish.categoryId?._id === selectedCategory;
      const matchSearch = searchQuery.trim()
        ? dish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dishType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(dishCat).toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchType && matchCategory && matchSearch;
    });
  }, [dishes, selectedType, selectedCategory, searchQuery]);

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* 1. BARRE DE RECHERCHE */}
      <div style={searchWrapperStyle}>
        <div style={searchBarContainerStyle}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Rechercher un plat, une boisson..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      </div>

      {/* 2. SÉLECTION RAPIDE DU TYPE (Tout / Nourriture / Boisson) */}
      <div style={typeTabsContainerStyle}>
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = selectedType === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedType(opt.id)}
              style={{
                ...typeTabButtonStyle,
                ...(isActive ? activeTypeTabStyle : inactiveTypeTabStyle)
              }}
            >
              {Icon && <Icon size={14} />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. FILTRES PAR CATÉGORIES (Normal / VIP / Spécial) */}
      <CategoryFilter
        categories={activeCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. LISTE DES PLATS */}
      <div style={listContainerStyle}>
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} onSelect={onSelectDish} />
          ))
        ) : (
          <div style={emptyStateStyle}>
            <UtensilsCrossed size={40} color="var(--text-muted)" />
            <h4 style={emptyTitleStyle}>Aucun plat trouvé</h4>
            <p style={emptyDescStyle}>Essayez d'ajuster vos termes de recherche ou de changer de filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingBottom: '24px'
};

const searchWrapperStyle = {
  padding: '12px 16px 2px'
};

const searchBarContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1.5px solid var(--border-color)',
  borderRadius: '14px',
  padding: '4px 14px'
};

const searchInputStyle = {
  border: 'none',
  backgroundColor: 'transparent',
  padding: '8px 0',
  boxShadow: 'none'
};

const typeTabsContainerStyle = {
  display: 'flex',
  gap: '8px',
  padding: '0 16px',
  alignItems: 'center'
};

const typeTabButtonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '8px 12px',
  borderRadius: '10px',
  fontSize: '0.80rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

const activeTypeTabStyle = {
  backgroundColor: 'var(--color-primary-surface)',
  color: 'var(--color-primary-dark)',
  border: '1.5px solid var(--color-primary)'
};

const inactiveTypeTabStyle = {
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)'
};

const listContainerStyle = {
  padding: '0 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const emptyStateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  textAlign: 'center',
  gap: '10px'
};

const emptyTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const emptyDescStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)',
  maxWidth: '300px'
};
