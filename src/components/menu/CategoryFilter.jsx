/**
 * Filtre horizontal par categories sous forme de pilules interactives.
 */

import React from 'react';

export const CategoryFilter = ({ categories = [], selectedCategory, onSelectCategory }) => {
  return (
    <div style={containerStyle}>
      <button
        onClick={() => onSelectCategory(null)}
        style={{
          ...pillStyle,
          ...(selectedCategory === null ? activePillStyle : inactivePillStyle)
        }}
      >
        Tous les plats
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat._id;
        return (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            style={{
              ...pillStyle,
              ...(isSelected ? activePillStyle : inactivePillStyle)
            }}
          >
            {cat.name}
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
  padding: '8px 16px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch'
};

const pillStyle = {
  whiteSpace: 'nowrap',
  padding: '8px 16px',
  borderRadius: '9999px',
  fontSize: '0.84rem',
  fontWeight: 700,
  transition: 'all 0.2s ease',
  flexShrink: 0
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
