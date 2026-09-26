/**
 * Modale de détails complets d'une commande (AdminOrderDetailsModal).
 * Affiche l'ensemble des informations de livraison, plats, client, livreur et chronologie des statuts.
 */

import React, { useState } from 'react';
import { X, User, Phone, MapPin, Truck, Package, Bike } from 'lucide-react';
import { theme } from '../../../styles/theme';
import { getOrderStatusLabel, getPaymentMethodLabel, getOrderStatusBadgeStyle } from '../../../utils/statusLabels';
import { AssignDriverModal } from './AssignDriverModal';
import { AdminOrderTimeline } from './AdminOrderTimeline';

export const AdminOrderDetailsModal = ({ order, onClose, drivers = [], onAssignDriver }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  if (!order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseignée';
    const d = new Date(dateString);
    return `${d.toLocaleDateString('fr-FR')} à ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const canAssignDriver = !['DELIVERED', 'CANCELLED'].includes(order.status);

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div style={headerStyle}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Commande #{order.orderNumber}
              </h2>
              <span style={{ ...getOrderStatusBadgeStyle(order.status), fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px' }}>
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
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
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Montant Total :</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {Number(order.total || 0).toLocaleString('fr-FR')} FCFA
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Livraison : {Number(order.deliveryFee || 0).toLocaleString('fr-FR')} FCFA
              </span>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {getPaymentMethodLabel(order.payment?.method || order.paymentMethod)}
              </div>
            </div>
          </div>

          {/* Informations Client & Livraison */}
          <div style={infoGridStyle}>
            <div style={sectionBoxStyle}>
              <div style={sectionTitleStyle}>
                <User size={16} /> Client
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {order.customer?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '4px' }}>
                <Phone size={14} color="var(--text-muted)" />
                <a href={`tel:${order.customer?.phone}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                  {order.customer?.phone}
                </a>
              </div>
            </div>

            <div style={sectionBoxStyle}>
              <div style={sectionTitleStyle}>
                <MapPin size={16} /> Adresse de livraison
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                {order.delivery?.address || 'Non spécifiée'}
              </div>
              {order.delivery?.note && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
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
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {order.driverId.firstName} {order.driverId.lastName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Phone size={13} color="var(--color-primary)" />
                    <a href={`tel:${order.driverId.phone}`} style={{ fontSize: '0.82rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                      {order.driverId.phone}
                    </a>
                  </div>
                </div>
                {canAssignDriver && (
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    style={changeDriverBtnStyle}
                  >
                    <Bike size={14} /> Changer
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Aucun livreur associé</span>
                {canAssignDriver && (
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    style={assignDriverBtnStyle}
                  >
                    <Bike size={15} /> Assigner un livreur
                  </button>
                )}
              </div>
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
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {item.quantity}x {item.name}
                    </span>
                    {item.selectedOptions?.length > 0 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.selectedOptions.join(', ')}
                      </div>
                    )}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {Number(item.subtotal || 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historique chronologique des statuts */}
          <AdminOrderTimeline statusHistory={order.statusHistory} />
        </div>

        {/* Modale d'attribution d'un livreur connecté */}
        <AssignDriverModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          order={order}
          drivers={drivers}
          onAssignDriver={onAssignDriver}
        />
      </div>
    </div>
  );
};

const backdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, padding: '16px'
};

const modalContainerStyle = {
  backgroundColor: 'var(--bg-elevated)', borderRadius: theme.radii.lg,
  maxWidth: '560px', width: '100%', maxHeight: '90vh',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)', overflow: 'hidden'
};

const headerStyle = {
  padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  backgroundColor: 'var(--bg-card-header)'
};

const closeButtonStyle = {
  background: 'none', border: 'none', color: 'var(--text-muted)',
  cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const bodyStyle = {
  padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px'
};

const summaryCardStyle = {
  padding: '14px 16px', backgroundColor: 'var(--color-primary-surface)',
  borderRadius: theme.radii.md, display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', border: '1px solid var(--color-primary-light)'
};

const infoGridStyle = {
  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px'
};

const sectionBoxStyle = {
  padding: '12px 14px', backgroundColor: 'var(--bg-secondary)',
  borderRadius: theme.radii.md, border: '1px solid var(--border-color)'
};

const sectionTitleStyle = {
  fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)',
  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
  textTransform: 'uppercase', letterSpacing: '0.04em'
};

const itemRowStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '6px 0', borderBottom: '1px solid var(--border-color)'
};

const stepRowStyle = {
  display: 'flex', alignItems: 'flex-start', gap: '10px',
  padding: '6px 0', borderBottom: '1px dashed var(--border-color)'
};

const assignDriverBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '6px 12px', borderRadius: '8px',
  backgroundColor: 'var(--color-primary)', color: '#FFFFFF',
  border: 'none', fontSize: '0.78rem', fontWeight: 700,
  cursor: 'pointer', transition: 'opacity 0.2s ease'
};

const changeDriverBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: '5px 10px', borderRadius: '6px',
  backgroundColor: 'var(--bg-card-header)', color: 'var(--color-primary)',
  border: '1px solid var(--border-color)', fontSize: '0.74rem', fontWeight: 700,
  cursor: 'pointer'
};
