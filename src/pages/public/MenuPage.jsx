/**
 * Page de la carte complète du menu (/menu).
 * Comprend la recherche instantanée, le filtrage par catégories et l'ajout au panier.
 */

import React, { useState, useMemo } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import { CategoryFilter } from '../../components/menu/CategoryFilter';
import { DishCard } from '../../components/menu/DishCard';

export const MenuPage = ({ dishes = [], categories = [], onSelectDish }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchCat = selectedCategory ? (dish.categoryId?._id || dish.categoryId) === selectedCategory : true;
      const matchSearch = searchQuery.trim()
        ? dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchCat && matchSearch;
    });
  }, [dishes, selectedCategory, searchQuery]);

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* 1. BARRE DE RECHERCHE */}
      <div style={searchWrapperStyle}>
        <div style={searchBarContainerStyle}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Rechercher un plat, une grillade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>
      </div>

      {/* 2. FILTRES PAR CATÉGORIES */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. LISTE DES PLATS */}
      <div style={listContainerStyle}>
        {filteredDishes.length > 0 ? (
          filteredDishes.map((dish) => (
            <DishCard key={dish._id} dish={dish} onSelect={onSelectDish} />
          ))
        ) : (
          <div style={emptyStateStyle}>
            <UtensilsCrossed size={40} color="var(--text-muted)" />
            <h4 style={emptyTitleStyle}>Aucun plat trouvé</h4>
            <p style={emptyDescStyle}>Essayez d'ajuster vos termes de recherche ou de changer de catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingBottom: '24px'
};

const searchWrapperStyle = {
  padding: '12px 16px 4px'
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
