/**
 * Modale de consultation et modification de commande (AdminOrderDetailsModal).
 * Permet l'assignation des livreurs et le changement direct d'etat.
 */

import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Phone, MapPin, User, Bike, CheckCircle2 } from 'lucide-react';

export const AdminOrderDetailsModal = ({
  order,
  isOpen,
  onClose,
  drivers = [],
  onUpdateStatus,
  onAssignDriver
}) => {
  if (!order) return null;

  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [selectedDriverId, setSelectedDriverId] = useState(order.driverId?._id || '');

  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  const handleSave = () => {
    if (selectedStatus !== order.status) {
      onUpdateStatus(order._id, selectedStatus);
    }
    if (selectedDriverId && selectedDriverId !== order.driverId?._id && onAssignDriver) {
      onAssignDriver(order._id, selectedDriverId);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Commande ${order.orderNumber}`}
      maxWidth="480px"
    >
      <div style={containerStyle}>
        {/* 1. Client & Contact */}
        <div style={sectionCardStyle}>
          <span style={sectionTitleStyle}>Informations Client</span>
          <div style={infoRowStyle}>
            <User size={15} color="var(--color-primary)" />
            <strong>{order.customer?.firstName} {order.customer?.lastName}</strong>
          </div>
          <div style={infoRowStyle}>
            <Phone size={15} color="var(--color-primary)" />
            <a href={`tel:${order.customer?.phone}`} style={linkStyle}>{order.customer?.phone}</a>
          </div>
          <div style={infoRowStyle}>
            <MapPin size={15} color="var(--color-primary)" />
            <span>{order.delivery?.address}</span>
          </div>
        </div>

        {/* 2. Plats commandes */}
        <div style={sectionCardStyle}>
          <span style={sectionTitleStyle}>Articles ({order.items?.length || 0})</span>
          <div style={itemsListStyle}>
            {order.items?.map((item, idx) => (
              <div key={idx} style={itemRowStyle}>
                <div>
                  <span style={itemNameStyle}>{item.dishName}</span>
                  <span style={itemQtyStyle}>Qté : {item.quantity} × {formatPrice(item.unitPrice)}</span>
                </div>
                <strong style={itemPriceStyle}>{formatPrice(item.subtotal)}</strong>
              </div>
            ))}
          </div>

          <div style={summaryRowStyle}>
            <span>Frais de livraison :</span>
            <span>{formatPrice(order.delivery?.fee)}</span>
          </div>
          <div style={{ ...summaryRowStyle, fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            <span>Total :</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* 3. Statut & Assignation Livreur */}
        <div style={sectionCardStyle}>
          <span style={sectionTitleStyle}>Gestion Opérationnelle</span>
          
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Statut de la commande</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="PENDING">PENDING (En attente)</option>
              <option value="CONFIRMED">CONFIRMED (Confirmée)</option>
              <option value="PREPARING">PREPARING (En préparation)</option>
              <option value="READY_FOR_PICKUP">READY_FOR_PICKUP (Prête en cuisine)</option>
              <option value="ASSIGNED">ASSIGNED (Assignée au livreur)</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (En cours de livraison)</option>
              <option value="DELIVERED">DELIVERED (Livrée avec succès)</option>
              <option value="CANCELLED">CANCELLED (Annulée)</option>
            </select>
          </div>

          {drivers.length > 0 && (
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Livreur assigné</label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                style={selectStyle}
              >
                <option value="">-- Aucun livreur assigné --</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.firstName} {d.lastName} ({d.driverStatus || 'OFFLINE'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <Button variant="secondary" size="md" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="primary" size="md" icon={CheckCircle2} onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const sectionCardStyle = {
  padding: '12px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const sectionTitleStyle = {
  fontSize: '0.8rem',
  fontWeight: 800,
  color: 'var(--color-primary)',
  textTransform: 'uppercase'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.82rem',
  color: 'var(--text-secondary)'
};

const linkStyle = {
  color: 'var(--color-primary)',
  fontWeight: 700,
  textDecoration: 'none'
};

const itemsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 0',
  borderBottom: '1px dashed var(--border-color)'
};

const itemNameStyle = {
  fontSize: '0.84rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  display: 'block'
};

const itemQtyStyle = {
  fontSize: '0.74rem',
  color: 'var(--text-muted)'
};

const itemPriceStyle = {
  fontSize: '0.84rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const labelStyle = {
  fontSize: '0.76rem',
  fontWeight: 700,
  color: 'var(--text-secondary)'
};

const selectStyle = {
  padding: '8px 10px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
  fontSize: '0.82rem',
  outline: 'none'
};

const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '6px'
};
