/**
 * Modale de création et d'édition d'une offre promotionnelle (PromotionEditModal).
 * Prise en charge du téléversement Cloudinary de la bannière et du ciblage de lien/plat.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, Trash2, Save, RefreshCw, Link2, Utensils } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { apiClient } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

export const PromotionEditModal = ({
  isOpen,
  onClose,
  promotion,
  dishes = [],
  onSavePromotion
}) => {
  const { showError, showSuccess } = useToast();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(promotion?._id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [redirectType, setRedirectType] = useState('none'); // 'none' | 'dish' | 'link'
  const [selectedDishId, setSelectedDishId] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promotion) {
      setTitle(promotion.title || '');
      setDescription(promotion.description || '');
      setImage(promotion.image || '');
      setIsActive(promotion.isActive !== undefined ? Boolean(promotion.isActive) : true);

      if (promotion.dishId) {
        setRedirectType('dish');
        setSelectedDishId(typeof promotion.dishId === 'object' ? promotion.dishId._id : promotion.dishId);
        setCustomLink('');
      } else if (promotion.link) {
        setRedirectType('link');
        setCustomLink(promotion.link);
        setSelectedDishId('');
      } else {
        setRedirectType('none');
        setSelectedDishId('');
        setCustomLink('');
      }
    } else {
      setTitle('');
      setDescription('');
      setImage('');
      setRedirectType('none');
      setSelectedDishId('');
      setCustomLink('');
      setIsActive(true);
    }
  }, [promotion, isOpen]);

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
        showSuccess('Bannière téléversée avec succès sur Cloudinary.');
      }
    } catch (err) {
      showError(err.message || 'Échec du téléversement de la bannière.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showError("Le titre de l'offre est obligatoire.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      isActive,
      link: redirectType === 'link' ? customLink.trim() : '',
      dishId: redirectType === 'dish' && selectedDishId ? selectedDishId : null
    };

    if (isEditing) {
      payload._id = promotion._id;
    }

    try {
      setIsSubmitting(true);
      const success = await onSavePromotion(payload);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const dishOptions = [
    { value: '', label: '-- Sélectionner un plat du menu --' },
    ...dishes.map((d) => ({
      value: d._id,
      label: `${d.name} (${Number(d.price || 0).toLocaleString('fr-FR')} FCFA)`
    }))
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Modifier l'offre" : 'Ajouter une offre'}
      size="md"
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Titre */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>
            Titre de l'offre <span style={{ color: 'var(--status-error)' }}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Bénéficiez de 50% dès samedi prochain !"
            style={inputStyle}
            maxLength={100}
            required
          />
        </div>

        {/* Message / Description */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Message / Description (optionnel)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détail de la promotion ou conditions particulières..."
            style={textareaStyle}
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Bannière / Image Cloudinary */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Bannière de l'offre (optionnelle)</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {image ? (
            <div style={imagePreviewContainerStyle}>
              <img src={image} alt="Bannière promotionnelle" style={imagePreviewStyle} />
              <div style={imageOverlayActionsStyle}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={iconActionButtonStyle}
                  title="Changer l'image"
                >
                  <RefreshCw size={15} color="var(--color-primary)" />
                </button>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  style={iconActionButtonStyle}
                  title="Supprimer la bannière"
                >
                  <Trash2 size={15} color="var(--status-error)" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={uploadPlaceholderBtnStyle}
            >
              <UploadCloud size={24} color="var(--color-primary)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isUploading ? 'Téléversement sur Cloudinary...' : 'Ajouter une bannière publicitaire'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Format JPG, PNG ou WebP conseillé
              </span>
            </button>
          )}
        </div>

        {/* Redirection / Lien */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Action au clic sur l'offre</label>
          <div style={radioGroupStyle}>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="redirectType"
                value="none"
                checked={redirectType === 'none'}
                onChange={() => setRedirectType('none')}
              />
              <span>Simple annonce</span>
            </label>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="redirectType"
                value="dish"
                checked={redirectType === 'dish'}
                onChange={() => setRedirectType('dish')}
              />
              <span>Rediriger vers un plat</span>
            </label>
            <label style={radioLabelStyle}>
              <input
                type="radio"
                name="redirectType"
                value="link"
                checked={redirectType === 'link'}
                onChange={() => setRedirectType('link')}
              />
              <span>Lien personnalisé</span>
            </label>
          </div>

          {redirectType === 'dish' && (
            <div style={{ marginTop: '8px' }}>
              <CustomSelect
                value={selectedDishId}
                onChange={setSelectedDishId}
                options={dishOptions}
                placeholder="Choisir un plat"
              />
            </div>
          )}

          {redirectType === 'link' && (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="Ex : https://monlien.ci ou menu"
                style={inputStyle}
                maxLength={300}
              />
            </div>
          )}
        </div>

        {/* Statut Actif */}
        <div style={toggleRowStyle}>
          <div>
            <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)', display: 'block' }}>
              Offre active
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Visible immédiatement sur l'application publique
            </span>
          </div>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={checkboxStyle}
          />
        </div>

        {/* Boutons d'action */}
        <div style={footerButtonsStyle}>
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Publier l\'offre'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '14px' };
const formGroupStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' };
const inputStyle = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '0.88rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit'
};
const imagePreviewContainerStyle = {
  position: 'relative',
  width: '100%',
  maxHeight: '160px',
  borderRadius: '10px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)'
};
const imagePreviewStyle = { width: '100%', height: '160px', objectFit: 'cover', display: 'block' };
const imageOverlayActionsStyle = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  display: 'flex',
  gap: '6px'
};
const iconActionButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};
const uploadPlaceholderBtnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  padding: '20px',
  borderRadius: '10px',
  border: '2px dashed var(--border-color)',
  backgroundColor: 'var(--bg-card-header)',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease'
};
const radioGroupStyle = { display: 'flex', flexWrap: 'wrap', gap: '12px' };
const radioLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)',
  cursor: 'pointer'
};
const toggleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '10px'
};
const checkboxStyle = { width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' };
const footerButtonsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '8px',
  paddingTop: '12px',
  borderTop: '1px solid var(--border-color)'
};
