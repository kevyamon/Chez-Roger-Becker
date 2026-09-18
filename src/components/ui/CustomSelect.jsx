/**
 * Composant de sélection personnalisée Mobile-First (CustomSelect).
 * Remplace les balises <select> natives pour offrir une modale de choix élégante et cohérente.
 */

import React, { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Modal } from './Modal';

export const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => (typeof opt === 'object' ? opt.value === value : opt === value));
  const displayLabel = selectedOption
    ? typeof selectedOption === 'object'
      ? selectedOption.label
      : selectedOption
    : placeholder;

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}{required && ' *'}</label>}

      {/* Déclencheur personnalisé */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={triggerButtonStyle}
        aria-haspopup="dialog"
      >
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {displayLabel}
        </span>
        <ChevronDown size={16} color="var(--text-secondary)" />
      </button>

      {/* Modale personnalisée de choix */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label ? `Choisir : ${label}` : 'Sélectionner une option'}
        maxWidth="380px"
      >
        <div style={optionsListStyle}>
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optVal === value;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => handleSelect(optVal)}
                style={{
                  ...optionItemStyle,
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                  backgroundColor: isSelected ? 'var(--color-primary-surface)' : 'var(--bg-elevated)'
                }}
              >
                <div style={optionContentStyle}>
                  <div
                    style={{
                      ...radioCircleStyle,
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent'
                    }}
                  >
                    {isSelected && <Check size={12} color="var(--color-primary-contrast, #FFFFFF)" />}
                  </div>
                  <span
                    style={{
                      ...optionTextStyle,
                      color: isSelected ? 'var(--color-primary-dark)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 700 : 500
                    }}
                  >
                    {optLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '100%'
};

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};

const triggerButtonStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-elevated)',
  fontSize: '0.84rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  transition: 'border-color 0.2s ease'
};

const optionsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '6px 0'
};

const optionItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--border-color)',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  transition: 'all 0.15s ease'
};

const optionContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const radioCircleStyle = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '2px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const optionTextStyle = {
  fontSize: '0.9rem'
};
