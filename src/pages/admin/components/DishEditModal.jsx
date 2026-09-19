/**
 * Modale de création et d'édition de plat (DishEditModal).
 * Sélection d'image avec téléversement Cloudinary et enregistrement asynchrone sécurisé.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, Trash2, Save, RefreshCw } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const CATEGORY_OPTIONS = ['Normal', 'VIP', 'Spécial'];
const TYPE_OPTIONS = ['Nourriture', 'Boisson'];
const DEFAULT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';

export const DishEditModal = ({
  isOpen,
  onClose,
  dish,
  categories = [],
  onSaveDish
}) => {
  const { showError, showSuccess } = useToast();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(dish?._id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Nourriture');
  const [category, setCategory] = useState('Normal');
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Veuillez sélectionner un fichier image valide.');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success && res.data?.url) {
        setImage(res.data.url);
        showSuccess('Image téléversée avec succès sur Cloudinary.');
      }
    } catch (err) {
      showError(err.message || 'Échec du téléversement de la photo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !category || !type) return;

    const matchedCategory = categories.find(
      (c) => c.name?.toLowerCase() === category.toLowerCase()
    );

    const safeDescription = description.trim().length >= 5
      ? description.trim()
      : `Savoureuse spécialité ${name.trim()} préparée par notre chef.`;

    const safeImage = image.trim() || DEFAULT_IMAGE_FALLBACK;

    try {
      setIsSubmitting(true);
      const success = await onSaveDish({
        ...(dish?._id ? { _id: dish._id } : {}),
        name: name.trim(),
        description: safeDescription,
        price: Number(price),
        type,
        category,
        ...(matchedCategory?._id ? { categoryId: matchedCategory._id } : {}),
        image: safeImage,
        preparationTime: Number(preparationTime) || 20,
        isFeatured,
        isAvailable
      });

      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
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

          <CustomSelect
            label="Type"
            value={type}
            onChange={setType}
            options={TYPE_OPTIONS}
            required
          />

          <CustomSelect
            label="Catégorie"
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
            required
          />
        </div>

        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Description gastronomique</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description détaillée du plat..."
            rows={2}
            style={textareaStyle}
          />
        </div>

        {/* SÉLECTEUR D'IMAGE GALERIE CLOUDINARY */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Photo du plat (depuis la galerie) *</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {image ? (
            <div style={imagePreviewContainerStyle}>
              <img src={image} alt="Aperçu du plat" style={imagePreviewStyle} />
              <div style={imageActionsStyle}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  icon={UploadCloud}
                >
                  {isUploading ? 'Téléversement...' : 'Changer la photo'}
                </Button>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  style={removeImageBtnStyle}
                  title="Retirer la photo"
                >
                  <Trash2 size={16} color="var(--status-error)" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={uploadPlaceholderStyle}
            >
              {isUploading ? (
                <div style={uploadingInnerStyle}>
                  <RefreshCw size={24} color="var(--color-primary)" className="animate-spin" />
                  <span style={uploadingTextStyle}>Téléversement en cours sur Cloudinary...</span>
                </div>
              ) : (
                <div style={uploadingInnerStyle}>
                  <ImageIcon size={28} color="var(--color-primary)" />
                  <span style={uploadTitleStyle}>Sélectionner une photo depuis la galerie</span>
                  <span style={uploadSubtitleStyle}>Formats JPEG, PNG, WEBP acceptés</span>
                </div>
              )}
            </button>
          )}
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
          <Button variant="secondary" size="md" type="button" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button variant="primary" size="md" type="submit" icon={Save} disabled={isUploading || isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer le plat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const labelStyle = { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' };
const inputStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.84rem', outline: 'none', width: '100%' };
const textareaStyle = { ...inputStyle, resize: 'vertical', fontFamily: 'inherit' };
const threeColsStyle = { display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: '8px' };

const imagePreviewContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)' };
const imagePreviewStyle = { width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' };
const imageActionsStyle = { display: 'flex', alignItems: 'center', gap: '8px' };
const removeImageBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px' };

const uploadPlaceholderStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '10px', border: '1.5px dashed var(--border-color)', backgroundColor: 'var(--bg-elevated)', cursor: 'pointer', width: '100%' };
const uploadingInnerStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' };
const uploadTitleStyle = { fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-primary)' };
const uploadSubtitleStyle = { fontSize: '0.72rem', color: 'var(--text-muted)' };
const uploadingTextStyle = { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' };

const checkboxesRowStyle = { display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' };
const checkboxLabelStyle = { display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-primary)', cursor: 'pointer', userSelect: 'none' };
const checkboxInputStyle = { width: '18px', height: '18px', margin: 0, padding: 0, accentColor: 'var(--color-primary)', cursor: 'pointer', flexShrink: 0 };
const footerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' };
