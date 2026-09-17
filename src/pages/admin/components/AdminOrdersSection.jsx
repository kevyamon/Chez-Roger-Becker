/**
 * Section Gestion des Commandes en direct (AdminOrdersSection).
 * Filtrage par statut, recherche et affichage paginé sécurisé.
 */

import React, { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { AdminOrderCard } from './AdminOrderCard';

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

  const safeOrders = Array.isArray(orders) ? orders : (orders?.items || []);

  const filteredOrders = safeOrders.filter((ord) => {
    const matchesStatus = filterStatus === 'ALL' || ord.status === filterStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer?.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

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
            <AdminOrderCard
              key={ord._id}
              order={ord}
              onSelectOrder={onSelectOrder}
              onUpdateStatus={onUpdateStatus}
            />
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
