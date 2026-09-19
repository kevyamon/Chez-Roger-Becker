/**
 * Section Historique et Statistiques du livreur (DriverHistorySection).
 * Affiche le bilan des livraisons terminées et le total du Cash collecté.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { History, Banknote, PackageCheck, Calendar, RefreshCw } from 'lucide-react';
import { apiClient } from '../../../services/api';
import { Button } from '../../../components/ui/Button';

export const DriverHistorySection = ({ driverStats }) => {
  const [historyOrders, setHistoryOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = useCallback(async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/driver/history?page=${pageNum}&limit=15`);
      if (res.success && res.data) {
        setHistoryOrders(res.data || []);
        if (res.pagination) {
          setTotal(res.pagination.total || 0);
        }
      }
    } catch (err) {
      console.warn('Erreur chargement historique livreur :', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(page);
  }, [fetchHistory, page]);

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
            <Banknote size={20} color="var(--status-success, #16A34A)" />
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

        {isLoading ? (
          <div style={centerTextStyle}>Chargement de l'historique...</div>
        ) : historyOrders.length === 0 ? (
          <div style={emptyTextStyle}>
            Aucune livraison terminée enregistrée pour le moment.
          </div>
        ) : (
          <div style={ordersListStyle}>
            {historyOrders.map((order) => (
              <div key={order._id} style={orderRowStyle}>
                <div style={orderInfoStyle}>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                    #{order.orderNumber}
                  </strong>
                  <span style={customerNameStyle}>{order.customer?.name}</span>
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
                <div style={orderAmountWrapStyle}>
                  <strong style={amountTextStyle}>
                    {(order.total || 0).toLocaleString('fr-FR')} FCFA
                  </strong>
                  <span style={statusDeliveredBadgeStyle}>Livrée</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const kpiGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px'
};

const kpiCardStyle = {
  padding: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '12px'
};

const iconBadgeStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-elevated)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const kpiLabelStyle = {
  display: 'block',
  fontSize: '0.72rem',
  color: 'var(--text-secondary)'
};

const kpiValueStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const historyListCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderRadius: '12px'
};

const historyHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const sectionTitleStyle = {
  fontSize: '0.94rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const ordersListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const orderRowStyle = {
  padding: '10px 12px',
  borderRadius: '8px',
  backgroundColor: 'var(--bg-elevated)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid var(--border-color)'
};

const orderInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const customerNameStyle = {
  fontSize: '0.78rem',
  color: 'var(--text-secondary)'
};

const dateStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '0.7rem',
  color: 'var(--text-muted)'
};

const orderAmountWrapStyle = {
  textAlign: 'right',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '4px'
};

const amountTextStyle = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: 'var(--status-success, #16A34A)'
};

const statusDeliveredBadgeStyle = {
  fontSize: '0.68rem',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: '4px',
  backgroundColor: 'rgba(34, 197, 94, 0.12)',
  color: 'var(--status-success, #16A34A)'
};

const centerTextStyle = {
  textAlign: 'center',
  padding: '20px',
  fontSize: '0.82rem',
  color: 'var(--text-secondary)'
};

const emptyTextStyle = {
  textAlign: 'center',
  padding: '24px 10px',
  fontSize: '0.82rem',
  color: 'var(--text-muted)'
};
