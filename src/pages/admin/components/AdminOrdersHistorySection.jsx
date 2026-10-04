/**
 * Section d'historique dédié des commandes terminées et livrées (AdminOrdersHistorySection).
 * Présente les commandes archivables avec suppression ciblée et ouverture de modale détaillée.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, ChevronRight, PackageCheck, RefreshCw, Trash2, Archive } from 'lucide-react';
import { apiClient } from '../../../services/api';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';
import { theme } from '../../../styles/theme';
import { getOrderStatusLabel, getOrderStatusBadgeStyle } from '../../../utils/statusLabels';

export const AdminOrdersHistorySection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      if (search) params.append('search', search);
      if (dateFilter) params.append('date', dateFilter);

      const res = await apiClient.get(`/admin/orders-history?${params.toString()}`);
      if (res.success && res.data) {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.items)
            ? res.data.items
            : (Array.isArray(res.data?.data) ? res.data.data : []));
        setOrders(rawItems);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn('Erreur lors du chargement de l\'historique :', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, dateFilter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleArchiveOrder = async (orderId) => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/archive`);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
      }
    } catch (err) {
      console.warn('Erreur archivage commande :', err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous certain de vouloir supprimer cette commande de l’historique ?')) {
      return;
    }
    try {
      const res = await apiClient.delete(`/admin/orders/${orderId}`);
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        if (selectedOrder?._id === orderId) setSelectedOrder(null);
      }
    } catch (err) {
      console.warn('Erreur suppression commande :', err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* En-tête et filtres */}
      <div style={filterContainerStyle}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={inputWrapperStyle}>
            <Search size={16} color="var(--text-muted)" />
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
            <Calendar size={16} color="var(--text-muted)" />
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
          <button onClick={fetchHistory} style={iconButtonStyle} title="Actualiser" aria-label="Actualiser">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Liste des cartes compactes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Chargement de l'historique...
        </div>
      ) : orders.length === 0 ? (
        <div style={emptyStateStyle}>
          <PackageCheck size={36} color="var(--text-muted)" />
          <div style={{ fontWeight: 600, marginTop: '8px', color: 'var(--text-primary)' }}>
            Aucune commande dans l'historique
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Commande #{ord.orderNumber}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                  {Number(ord.total || 0).toLocaleString('fr-FR')} FCFA
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ ...getOrderStatusBadgeStyle(ord.status), fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: theme.radii.full }}>
                  {getOrderStatusLabel(ord.status)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchiveOrder(ord._id);
                  }}
                  style={iconActionBtnStyle}
                  title="Archiver pour nettoyer la liste"
                  aria-label="Archiver"
                >
                  <Archive size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOrder(ord._id);
                  }}
                  style={iconActionBtnDeleteStyle}
                  title="Supprimer définitivement"
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale de détails complets */}
      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onArchiveOrder={handleArchiveOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      )}
    </div>
  );
};

const filterContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--bg-elevated)',
  padding: '14px 16px',
  borderRadius: theme.radii.md,
  border: '1px solid var(--border-color)'
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: theme.radii.sm,
  flex: 1
};

const inputFieldStyle = {
  border: 'none',
  background: 'transparent',
  outline: 'none',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
  width: '100%'
};

const actionButtonStyle = {
  padding: '8px 16px',
  backgroundColor: 'var(--color-primary)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: theme.radii.sm,
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const iconButtonStyle = {
  padding: '8px',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: theme.radii.sm,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cardStyle = {
  padding: '14px 16px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1px solid var(--border-color)',
  borderRadius: theme.radii.md,
  boxShadow: 'var(--card-shadow)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, transform 0.15s ease'
};

const iconActionBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  borderRadius: '6px',
  backgroundColor: 'var(--bg-card-header)',
  color: 'var(--color-primary)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer'
};

const iconActionBtnDeleteStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px',
  borderRadius: '6px',
  backgroundColor: 'var(--color-primary-surface)',
  color: 'var(--status-error)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer'
};

const emptyStateStyle = {
  padding: '48px 20px',
  textAlign: 'center',
  backgroundColor: 'var(--bg-elevated)',
  borderRadius: theme.radii.md,
  border: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};
