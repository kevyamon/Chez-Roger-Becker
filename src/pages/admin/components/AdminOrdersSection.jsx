/**
 * Section Gestion des Commandes en direct (AdminOrdersSection).
 * Filtrage par statut, mise a jour des etapes et assignation des livreurs.
 */

import React, { useState } from 'react';
import { Search, Filter, Phone, MapPin, Eye, Check, Clock } from 'lucide-react';

export const AdminOrdersSection = ({
  orders = [],
  onUpdateStatus,
  onSelectOrder,
  isLoading
}) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFilters = [
    { id: 'ALL', label: 'Toutes' },
    { id: 'PENDING', label: 'En attente' },
    { id: 'PREPARING', label: 'En cuisine' },
    { id: 'ASSIGNED', label: 'Assignées' },
    { id: 'OUT_FOR_DELIVERY', label: 'En livraison' },
    { id: 'DELIVERED', label: 'Livrées' },
    { id: 'CANCELLED', label: 'Annulées' }
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'ALL' || ord.status === filterStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer?.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const formatPrice = (amount) => `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`;

  return (
    <div style={containerStyle}>
      {/* 1. Barre de recherche et filtres rapides */}
      <div className="card-surface" style={filterCardStyle}>
        <div style={searchWrapStyle}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Rechercher par numéro, nom ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <div style={pillFilterWrapStyle}>
          {statusFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterStatus(f.id)}
              style={filterStatus === f.id ? activePillStyle : inactivePillStyle}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Liste des commandes */}
      {isLoading ? (
        <p style={messageStyle}>Chargement des commandes en cours...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="card-surface" style={emptyCardStyle}>
          <Clock size={32} color="var(--text-muted)" />
          <p style={messageStyle}>Aucune commande ne correspond aux critères sélectionnés.</p>
        </div>
      ) : (
        <div style={ordersGridStyle}>
          {filteredOrders.map((ord) => (
            <div key={ord._id} className="card-surface" style={orderCardStyle}>
              <div style={orderHeaderStyle}>
                <div>
                  <span style={orderNumberStyle}>{ord.orderNumber}</span>
                  <p style={dateStyle}>{new Date(ord.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span style={statusBadgeStyle(ord.status)}>{ord.status}</span>
              </div>

              <div style={customerInfoStyle}>
                <p style={customerNameStyle}>{ord.customer?.firstName} {ord.customer?.lastName}</p>
                <div style={infoRowStyle}>
                  <Phone size={13} color="var(--color-primary)" />
                  <span>{ord.customer?.phone}</span>
                </div>
                <div style={infoRowStyle}>
                  <MapPin size={13} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.78rem' }}>{ord.delivery?.address}</span>
                </div>
              </div>

              <div style={orderFooterStyle}>
                <div>
                  <span style={totalLabelStyle}>Total commande :</span>
                  <strong style={totalPriceStyle}>{formatPrice(ord.total)}</strong>
                </div>

                <div style={actionButtonsStyle}>
                  <button
                    type="button"
                    onClick={() => onSelectOrder(ord)}
                    style={viewButtonStyle}
                    title="Voir les détails"
                  >
                    <Eye size={15} />
                    <span>Détails</span>
                  </button>

                  {ord.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(ord._id, 'CONFIRMED')}
                      style={confirmButtonStyle}
                    >
                      <Check size={14} /> Confirmer
                    </button>
                  )}
                  {ord.status === 'CONFIRMED' && (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(ord._id, 'PREPARING')}
                      style={confirmButtonStyle}
                    >
                      Cuisine
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const filterCardStyle = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const searchWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-card-header)',
  borderRadius: '8px',
  border: '1px solid var(--border-color)'
};

const searchInputStyle = {
  border: 'none',
  background: 'transparent',
  width: '100%',
  outline: 'none',
  fontSize: '0.84rem',
  color: 'var(--text-primary)'
};

const pillFilterWrapStyle = {
  display: 'flex',
  gap: '6px',
  overflowX: 'auto',
  paddingBottom: '2px',
  scrollbarWidth: 'none'
};

const pillBaseStyle = {
  padding: '5px 10px',
  borderRadius: '16px',
  fontSize: '0.74rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'all 0.15s ease'
};

const activePillStyle = {
  ...pillBaseStyle,
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF'
};

const inactivePillStyle = {
  ...pillBaseStyle,
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--text-secondary)',
  borderColor: 'var(--border-color)'
};

const ordersGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const orderCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const orderHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '8px'
};

const orderNumberStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const dateStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)'
};

const statusBadgeStyle = (status) => ({
  fontSize: '0.7rem',
  fontWeight: 800,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: status === 'DELIVERED' ? 'var(--color-accent-surface)' : 'var(--color-primary-surface)',
  color: status === 'DELIVERED' ? 'var(--color-accent-dark)' : 'var(--color-primary-dark)'
});

const customerInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const customerNameStyle = {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: 'var(--text-primary)'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8rem',
  color: 'var(--text-secondary)'
};

const orderFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '8px',
  borderTop: '1px solid var(--border-color)'
};

const totalLabelStyle = {
  fontSize: '0.72rem',
  color: 'var(--text-muted)',
  display: 'block'
};

const totalPriceStyle = {
  fontSize: '0.92rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const actionButtonsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const viewButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-card-header)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer'
};

const confirmButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 12px',
  borderRadius: '8px',
  backgroundColor: 'var(--status-success)',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer'
};

const emptyCardStyle = {
  padding: '30px 16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  textAlign: 'center'
};

const messageStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-muted)'
};
