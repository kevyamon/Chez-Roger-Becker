/**
 * Section d'historique dédié des commandes terminées et livrées (AdminOrdersHistorySection).
 * Présente une liste épurée (numéro et montant) avec ouverture de modale détaillée au clic.
 */

import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../services/api';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';
import { theme } from '../../../styles/theme';

export const AdminOrdersHistorySection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      if (search) params.append('search', search);
      if (dateFilter) params.append('date', dateFilter);

      const res = await apiClient.get(`/admin/orders-history?${params.toString()}`);
      if (res.success) {
        setOrders(res.data?.data || res.data || []);
        if (res.pagination) {
          setTotalPages(Math.ceil((res.pagination.total || 0) / 20));
        }
      }
    } catch (err) {
      console.warn('Erreur lors du chargement de l\'historique :', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* En-tête et filtres */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-elevated, #FFFFFF)',
          padding: '14px 16px',
          borderRadius: theme.radii.md,
          border: '1px solid var(--border-color, #E2E8F0)'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={inputWrapperStyle}>
            <Search size={16} color="var(--text-muted, #94A3B8)" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputFieldStyle}
            />
          </div>
          <button type="submit" style={actionButtonStyle}>
            Filtrer
          </button>
        </form>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={inputWrapperStyle}>
            <Calendar size={16} color="var(--text-muted, #94A3B8)" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              style={inputFieldStyle}
            />
          </div>
          <button onClick={fetchHistory} style={iconButtonStyle} title="Actualiser">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Liste des cartes compactes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary, #475569)' }}>
          Chargement de l'historique...
        </div>
      ) : orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <PackageCheck size={36} color="var(--text-muted, #94A3B8)" />
          <div style={{ fontWeight: 600, marginTop: '8px', color: 'var(--text-primary, #0F172A)' }}>
            Aucune commande dans l'historique
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #475569)' }}>
            Les commandes livrées ou clôturées apparaîtront ici.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {orders.map((ord) => (
            <div
              key={ord._id}
              onClick={() => setSelectedOrder(ord)}
              style={cardStyle}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary, #E65100)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color, #E2E8F0)')}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
                  Commande #{ord.orderNumber}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary, #E65100)', marginTop: '4px' }}>
                  {Number(ord.total || 0).toLocaleString('fr-FR')} FCFA
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94A3B8)', marginTop: '2px' }}>
                  {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={ord.status === 'DELIVERED' ? deliveredBadgeStyle : cancelledBadgeStyle}>
                  {ord.status === 'DELIVERED' ? 'Livrée' : 'Annulée'}
                </span>
                <ChevronRight size={18} color="var(--text-muted, #94A3B8)" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale de détails complets */}
      {selectedOrder && (
        <AdminOrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-secondary, #F8FAFC)',
  border: '1px solid var(--border-color, #E2E8F0)',
  borderRadius: theme.radii.sm,
  flex: 1
};

const inputFieldStyle = {
  border: 'none',
  background: 'transparent',
  outline: 'none',
  color: 'var(--text-primary, #0F172A)',
  fontSize: '0.85rem',
  width: '100%'
};

const actionButtonStyle = {
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary, #E65100)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: theme.radii.sm,
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const iconButtonStyle = {
  padding: '8px',
  backgroundColor: 'var(--bg-secondary, #F8FAFC)',
  border: '1px solid var(--border-color, #E2E8F0)',
  borderRadius: theme.radii.sm,
  color: 'var(--text-secondary, #475569)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cardStyle = {
  padding: '14px 16px',
  backgroundColor: 'var(--bg-elevated, #FFFFFF)',
  border: '1px solid var(--border-color, #E2E8F0)',
  borderRadius: theme.radii.md,
  boxShadow: 'var(--card-shadow, 0 4px 20px rgba(0,0,0,0.06))',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, transform 0.15s ease'
};

const deliveredBadgeStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: theme.radii.full,
  backgroundColor: 'rgba(22, 163, 74, 0.12)',
  color: 'var(--status-success, #16A34A)'
};

const cancelledBadgeStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '3px 8px',
  borderRadius: theme.radii.full,
  backgroundColor: 'rgba(220, 38, 38, 0.12)',
  color: 'var(--status-error, #DC2626)'
};

const emptyStateStyle = {
  padding: '48px 20px',
  textAlign: 'center',
  backgroundColor: 'var(--bg-elevated, #FFFFFF)',
  borderRadius: theme.radii.md,
  border: '1px solid var(--border-color, #E2E8F0)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};
