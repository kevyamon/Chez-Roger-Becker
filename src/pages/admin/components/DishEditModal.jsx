/**
 * Modale de création et d'édition de plat (DishEditModal).
 * Formulaire mobile-first avec catégories pré-configurées, type (Nourriture/Boisson) et validation.
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Save } from 'lucide-react';

const CATEGORY_OPTIONS = ['Normal', 'VIP', 'Spécial'];
const TYPE_OPTIONS = ['Nourriture', 'Boisson'];

export const DishEditModal = ({
  isOpen,
  onClose,
  dish,
  categories = [],
  onSaveDish
}) => {
  const isEditing = Boolean(dish?._id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Nourriture');
  const [category, setCategory] = useState('Normal');
  const [image, setImage] = useState('');
  const [preparationTime, setPreparationTime] = useState('20');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setDescription(dish.description || '');
      setPrice(dish.price ? String(dish.price) : '');
      setType(dish.type || 'Nourriture');
      setCategory(dish.category || dish.categoryId?.name || 'Normal');
      setImage(dish.image || '');
      setPreparationTime(dish.preparationTime ? String(dish.preparationTime) : '20');
      setIsFeatured(Boolean(dish.isFeatured));
      setIsAvailable(dish.isAvailable !== undefined ? Boolean(dish.isAvailable) : true);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setType('Nourriture');
      setCategory('Normal');
      setImage('');
      setPreparationTime('20');
      setIsFeatured(false);
      setIsAvailable(true);
    }
  }, [dish, categories, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !category || !type) return;

    // Association automatique avec un categoryId existant si disponible
    const matchedCategory = categories.find(
      (c) => c.name?.toLowerCase() === category.toLowerCase()
    );

    onSaveDish({
      ...(dish?._id ? { _id: dish._id } : {}),
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      type,
      category,
      ...(matchedCategory?._id ? { categoryId: matchedCategory._id } : {}),
      image: image.trim(),
      preparationTime: Number(preparationTime) || 20,
      isFeatured,
      isAvailable
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Nom du plat *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du plat"
            required
            style={inputStyle}
          />
        </div>

        <div style={threeColsStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Prix (FCFA) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Prix en FCFA"
              required
              min="0"
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              style={inputStyle}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Catégorie *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={inputStyle}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Description gastronomique</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée du plat..."
            rows={3}
            style={textareaStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>URL de la photo</label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <div style={checkboxesRowStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              style={checkboxInputStyle}
            />
            <span>Mettre en avant sur l'accueil</span>
          </label>

          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              style={checkboxInputStyle}
            />
            <span>Disponible à la commande</span>
          </label>
        </div>

        <div style={footerStyle}>
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" size="md" type="submit" icon={Save}>
            {isEditing ? 'Mettre à jour' : 'Créer le plat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '0.84rem',
  outline: 'none',
  width: '100%'
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit'
};

const threeColsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '10px'
};

const checkboxesRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '6px 0'
};

const checkboxLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.82rem',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  userSelect: 'none'
};

const checkboxInputStyle = {
  width: '18px',
  height: '18px',
  margin: 0,
  padding: 0,
  accentColor: 'var(--color-primary)',
  cursor: 'pointer',
  flexShrink: 0
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '8px'
};

