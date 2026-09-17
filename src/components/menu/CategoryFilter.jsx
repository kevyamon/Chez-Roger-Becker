/**
 * Filtre horizontal par catégories sous forme de pilules interactives.
 * Compatible avec les listes de chaînes ou d'objets de catégories.
 */

import React from 'react';

export const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div style={containerStyle}>
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        style={{
          ...pillStyle,
          ...(selectedCategory === null ? activePillStyle : inactivePillStyle)
        }}
      >
        Toutes les catégories
      </button>

      {categories.map((cat) => {
        const catKey = typeof cat === 'string' ? cat : cat._id || cat.name;
        const catLabel = typeof cat === 'string' ? cat : cat.name;
        const isSelected = selectedCategory === catKey || selectedCategory === catLabel;

        return (
          <button
            key={catKey}
            type="button"
            onClick={() => onSelectCategory(catKey)}
            style={{
              ...pillStyle,
              ...(isSelected ? activePillStyle : inactivePillStyle)
            }}
          >
            {catLabel}
          </button>
        );
      })}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  overflowX: 'auto',
  padding: '6px 16px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch'
};

const pillStyle = {
  whiteSpace: 'nowrap',
  padding: '6px 14px',
  borderRadius: '9999px',
  fontSize: '0.80rem',
  fontWeight: 700,
  transition: 'all 0.2s ease',
  flexShrink: 0,
  cursor: 'pointer'
};

const activePillStyle = {
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  boxShadow: '0 4px 12px rgba(230, 81, 0, 0.3)'
};

const inactivePillStyle = {
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border-color)'
};
