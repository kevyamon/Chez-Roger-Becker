/**
 * Barre de recherche de commande par numéro ou jeton (OrderSearchBar).
 */

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const OrderSearchBar = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={inputWrapperStyle}>
        <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Rechercher par N° RB-XXXXXX ou jeton..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        {query && (
          <button type="button" onClick={handleClear} style={clearBtnStyle}>
            <X size={16} color="var(--text-muted)" />
          </button>
        )}
      </div>
      <button type="submit" disabled={!query.trim() || isLoading} style={searchBtnStyle}>
        {isLoading ? 'Recherche...' : 'Rechercher'}
      </button>
    </form>
  );
};

const formStyle = {
  display: 'flex',
  gap: '8px',
  width: '100%'
};

const inputWrapperStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 14px',
  borderRadius: '12px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--card-shadow)'
};

const inputStyle = {
  flex: 1,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  color: 'var(--text-primary)',
  fontSize: '0.84rem',
  fontWeight: 600
};

const clearBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const searchBtnStyle = {
  padding: '0 16px',
  borderRadius: '12px',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-primary-contrast, #FFFFFF)',
  border: 'none',
  fontSize: '0.82rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
  boxShadow: '0 4px 12px rgba(230, 81, 0, 0.25)',
  whiteSpace: 'nowrap'
};
