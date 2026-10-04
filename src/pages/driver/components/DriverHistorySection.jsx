/**
 * Section Historique et Statistiques du livreur (DriverHistorySection).
 * Affiche le bilan des livraisons terminées, le Cash collecté, et permet d'archiver/purger les courses.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { History, Banknote, PackageCheck, Calendar, RefreshCw, ChevronLeft, ChevronRight, Archive, Trash2 } from 'lucide-react';
import { apiClient } from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useToast } from '../../../context/ToastContext';

export const DriverHistorySection = ({ driverStats }) => {
  const { showSuccess, showError } = useToast();
  const [historyOrders, setHistoryOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const fetchHistory = useCallback(async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/driver/history?page=${pageNum}&limit=${limit}`);
      if (res.success && res.data) {
        const rawItems = Array.isArray(res.data)
          ? res.data
          : (Array.isArray(res.data?.items)
            ? res.data.items
            : (Array.isArray(res.data?.orders) ? res.data.orders : []));
        setHistoryOrders(rawItems);
        const pag = res.data?.pagination || res.pagination;
        setTotal(pag?.total !== undefined ? pag.total : rawItems.length);
      } else {
        setHistoryOrders([]);
      }
    } catch (err) {
      console.warn('Erreur chargement historique livreur :', err.message);
      setHistoryOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(page);
  }, [fetchHistory, page]);

  const handleArchiveDelivery = async (orderId) => {
    try {
      const res = await apiClient.patch(`/driver/orders/${orderId}/archive`);
      if (res.success) {
        setHistoryOrders((prev) => prev.filter((o) => (o._id || o.id) !== orderId));
        setTotal((prev) => Math.max(0, prev - 1));
        showSuccess('Course masquée de votre historique.');
      }
    } catch (err) {
      showError(err.message || 'Impossible de masquer cette course.');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Voulez-vous effacer l’ensemble de vos livraisons terminées de votre historique ?')) {
      return;
    }
    try {
      setIsClearing(true);
      const res = await apiClient.delete('/driver/history');
      if (res.success) {
        setHistoryOrders([]);
        setTotal(0);
        showSuccess('Historique de livraisons effacé avec succès.');
      }
    } catch (err) {
      showError(err.message || 'Erreur lors de la suppression de l’historique.');
    } finally {
      setIsClearing(false);
    }
  };

  const safeOrders = Array.isArray(historyOrders) ? historyOrders : [];
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div style={containerStyle}>
      {/* 1. CARTES RÉCAPITULATIVES DES PERFORMANCES */}
      <div style={kpiGridStyle}>
        <div className="card-surface" style={kpiCardStyle}>
          <div style={iconBadgeStyle}>
            <PackageCheck size={20} color="var(--color-primary)" />
          </div>
          <div>
            <span style={kpiLabelStyle}>Livraisons Aujourd'hui</span>
            <strong style={kpiValueStyle}>{driverStats?.todayDeliveries || 0}</strong>
          </div>
        </div>

        <div className="card-surface" style={kpiCardStyle}>
          <div style={iconBadgeStyle}>
            <Banknote size={20} color="var(--status-success)" />
          </div>
          <div>
            <span style={kpiLabelStyle}>Cash Encaissé (Total)</span>
            <strong style={kpiValueStyle}>
              {(driverStats?.totalCashCollected || 0).toLocaleString('fr-FR')} F
            </strong>
          </div>
        </div>
      </div>

      {/* 2. LISTE DES COURSES TERMINÉES */}
      <div className="card-surface" style={historyListCardStyle}>
        <div style={historyHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--color-primary)" />
            <h4 style={sectionTitleStyle}>Historique des Courses</h4>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {safeOrders.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                disabled={isClearing}
                style={clearHistoryBtnStyle}
                title="Purger l'historique"
              >
                <Trash2 size={13} />
                <span>{isClearing ? 'Purge…' : 'Vider'}</span>
              </button>
            )}
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchHistory(page)}
              disabled={isLoading}
            >
              Actualiser
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner
            size="sm"
            message="Chargement de l'historique..."
            subMessage="Récupération de vos livraisons terminées"
          />
        ) : safeOrders.length === 0 ? (
          <div style={emptyTextStyle}>
            Aucune livraison terminée enregistrée pour le moment.
          </div>
        ) : (
          <div style={ordersListStyle}>
            {safeOrders.map((order) => {
              const orderId = order._id || order.id;
              return (
                <div key={orderId} style={orderRowStyle}>
                  <div style={orderInfoStyle}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                      #{order.orderNumber}
                    </strong>
                    <span style={customerNameStyle}>{order.customer?.name || 'Client'}</span>
                    <span style={dateStyle}>
                      <Calendar size={12} />
                      {new Date(order.updatedAt || order.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div style={orderRightColStyle}>
                    <div style={orderAmountWrapStyle}>
                      <strong style={amountTextStyle}>
                        {(order.total || 0).toLocaleString('fr-FR')} FCFA
                      </strong>
                      <span style={statusDeliveredBadgeStyle}>Livrée</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleArchiveDelivery(orderId)}
                      style={archiveOrderBtnStyle}
                      title="Masquer de votre historique"
                      aria-label="Masquer la course"
                    >
                      <Archive size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination si plusieurs pages */}
            {totalPages > 1 && (
              <div style={paginationWrapStyle}>
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={paginationBtnStyle}
                >
                  <ChevronLeft size={16} /> Précédent
                </button>
                <span style={paginationInfoStyle}>
                  Page {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={paginationBtnStyle}
                >
                  Suivant <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', flexDirection: 'column', gap: '14px' };
const kpiGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const kpiCardStyle = { padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px' };
const iconBadgeStyle = { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const kpiLabelStyle = { display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)' };
const kpiValueStyle = { fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' };
const historyListCardStyle = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: '12px' };
const historyHeaderStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' };
const sectionTitleStyle = { fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' };
const clearHistoryBtnStyle = { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '8px', backgroundColor: 'var(--color-primary-surface)', color: 'var(--status-error)', border: '1px solid var(--border-color)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' };
const ordersListStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const orderRowStyle = { padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color)' };
const orderInfoStyle = { display: 'flex', flexDirection: 'column', gap: '2px' };
const customerNameStyle = { fontSize: '0.78rem', color: 'var(--text-secondary)' };
const dateStyle = { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' };
const orderRightColStyle = { display: 'flex', alignItems: 'center', gap: '10px' };
const orderAmountWrapStyle = { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' };
const amountTextStyle = { fontSize: '0.88rem', fontWeight: 800, color: 'var(--status-success)' };
const statusDeliveredBadgeStyle = { fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--color-primary-surface)', color: 'var(--status-success)' };
const archiveOrderBtnStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: '6px', backgroundColor: 'var(--bg-card-header)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', cursor: 'pointer' };
const emptyTextStyle = { textAlign: 'center', padding: '24px 10px', fontSize: '0.82rem', color: 'var(--text-muted)' };
const paginationWrapStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)' };
const paginationBtnStyle = { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' };
const paginationInfoStyle = { fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 };
