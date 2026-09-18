/**
 * Modale de détails complets d'une commande (AdminOrderDetailsModal).
 * Affiche l'ensemble des informations de livraison, plats, client, livreur et chronologie des statuts.
 */

import React from 'react';
import { X, Clock, User, Phone, MapPin, Truck, CheckCircle, Package } from 'lucide-react';
import { theme } from '../../../styles/theme';

export const AdminOrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseignée';
    const d = new Date(dateString);
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div style={headerStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="var(--color-primary, #E65100)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary, #0F172A)' }}>
                Commande #{order.orderNumber}
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94A3B8)', marginTop: '4px' }}>
              Reçue le {formatDate(order.createdAt)}
            </div>
          </div>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* Corps défilable */}
        <div style={bodyStyle}>
          {/* Section Montant & Paiement */}
          <div style={summaryCardStyle}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #475569)' }}>Montant Total :</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #E65100)' }}>
                {Number(order.total || 0).toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94A3B8)' }}>
                Livraison : {Number(order.deliveryFee || 0).toLocaleString('fr-FR')} FCFA
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary, #0F172A)', marginTop: '2px' }}>
                {order.payment?.method === 'CASH_ON_DELIVERY' ? 'Paiement à la livraison' : 'Paiement en ligne'}
              </div>
            </div>
          </div>

          {/* Informations Client & Livraison */}
          <div style={infoGridStyle}>
            <div style={sectionBoxStyle}>
              <div style={sectionTitleStyle}>
                <User size={16} /> Client
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
                {order.customer?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '4px' }}>
                <Phone size={14} color="var(--text-muted, #94A3B8)" />
                <a href={`tel:${order.customer?.phone}`} style={{ color: 'var(--color-primary, #E65100)', textDecoration: 'none' }}>
                  {order.customer?.phone}
                </a>
              </div>
            </div>

            <div style={sectionBoxStyle}>
              <div style={sectionTitleStyle}>
                <MapPin size={16} /> Adresse de livraison
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary, #0F172A)' }}>
                {order.delivery?.address || 'Non spécifiée'}
              </div>
              {order.delivery?.note && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #475569)', marginTop: '4px', fontStyle: 'italic' }}>
                  Note : {order.delivery.note}
                </div>
              )}
            </div>
          </div>

          {/* Livreur assigné */}
          <div style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>
              <Truck size={16} /> Livreur assigné
            </div>
            {order.driverId ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
                  {order.driverId.firstName} {order.driverId.lastName}
                </span>
                <a href={`tel:${order.driverId.phone}`} style={{ fontSize: '0.85rem', color: 'var(--color-primary, #E65100)', textDecoration: 'none' }}>
                  {order.driverId.phone}
                </a>
              </div>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94A3B8)' }}>Aucun livreur associé</span>
            )}
          </div>

          {/* Contenu de la commande */}
          <div style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>
              <Package size={16} /> Articles commandés ({order.items?.length || 0})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={itemRowStyle}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary, #0F172A)' }}>
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedOptions?.length > 0 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94A3B8)' }}>
                        {item.selectedOptions.join(', ')}
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary, #0F172A)' }}>
                    {Number(item.subtotal || 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historique chronologique des statuts */}
          <div style={sectionBoxStyle}>
            <div style={sectionTitleStyle}>
              <Clock size={16} /> Chronologie des étapes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.statusHistory?.map((step, idx) => (
                <div key={idx} style={stepRowStyle}>
                  <CheckCircle size={14} color="var(--status-success, #16A34A)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary, #0F172A)' }}>
                      {step.status}
                    </div>
                    {step.note && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #475569)' }}>{step.note}</div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94A3B8)' }}>
                    {formatDate(step.changedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '16px'
};

const modalContainerStyle = {
  backgroundColor: 'var(--bg-elevated, #FFFFFF)',
  borderRadius: theme.radii.lg,
  maxWidth: '560px',
  width: '100%',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  overflow: 'hidden',
  animation: 'fadeIn 0.2s ease'
};

const headerStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid var(--border-color, #E2E8F0)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--bg-card-header, rgba(0,0,0,0.02))'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted, #94A3B8)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const bodyStyle = {
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const summaryCardStyle = {
  padding: '14px 16px',
  backgroundColor: 'var(--color-primary-surface, #FFF3E0)',
  borderRadius: theme.radii.md,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '1px solid var(--color-primary-light, #FF7A00)'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px'
};

const sectionBoxStyle = {
  padding: '12px 14px',
  backgroundColor: 'var(--bg-secondary, #F8FAFC)',
  borderRadius: theme.radii.md,
  border: '1px solid var(--border-color, #E2E8F0)'
};

const sectionTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-secondary, #475569)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
  borderBottom: '1px solid var(--border-color, #E2E8F0)'
};

const stepRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '6px 0',
  borderBottom: '1px dashed var(--border-color, #E2E8F0)'
};
