/**
 * Page "Mes commandes" publique (/commande/suivi/:token).
 * Propose la recherche par numéro/jeton, la liste de l'historique local et le suivi live cartographique.
 */

import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/api';
import { OrderSearchBar } from './components/OrderSearchBar';
import { OrderHistoryList } from './components/OrderHistoryList';
import { OrderDetailView } from './components/OrderDetailView';
import { Button } from '../../components/ui/Button';

export const OrderTrackingPage = ({ trackingToken: initialToken, onNavigate }) => {
  const [activeIdentifier, setActiveIdentifier] = useState(() => {
    return initialToken || localStorage.getItem('rb_last_tracking_token') || null;
  });

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Historique des commandes locales
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rb_orders_history') || '[]');
    } catch {
      return [];
    }
  });

  const fetchOrder = async (identifier) => {
    if (!identifier) {
      setOrder(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get(`/orders/track/${encodeURIComponent(identifier)}`);
      if (res.success && res.data?.order) {
        const fetched = res.data.order;
        setOrder(fetched);

        // Mise à jour de l'état dans l'historique local
        setOrderHistory((prev) => {
          const updated = prev.map((item) =>
            item.trackingToken === fetched.trackingToken || item.orderNumber === fetched.orderNumber
              ? { ...item, status: fetched.status, total: fetched.total }
              : item
          );
          localStorage.setItem('rb_orders_history', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      setError(err.message || 'Impossible de trouver la commande correspondante.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeIdentifier) {
      fetchOrder(activeIdentifier);
    }
  }, [activeIdentifier]);

  const handleSelectOrder = (identifier) => {
    setActiveIdentifier(identifier);
    localStorage.setItem('rb_last_tracking_token', identifier);
  };

  const handleBackToList = () => {
    setActiveIdentifier(null);
    setOrder(null);
    setError(null);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('rb_orders_history');
    setOrderHistory([]);
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* 1. BARRE DE RECHERCHE DE COMMANDE */}
      <OrderSearchBar onSearch={handleSelectOrder} isLoading={isLoading} />

      {/* 2. ÉTAT DE CHARGEMENT */}
      {isLoading && (
        <div style={centerStyle}>
          <RefreshCw size={32} color="var(--color-primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Recherche de la commande...</p>
        </div>
      )}

      {/* 3. ERREUR OU COMMANDE INTROUVABLE */}
      {!isLoading && error && (
        <div className="card-surface" style={errorCardStyle}>
          <AlertCircle size={36} color="var(--status-error)" />
          <h4 style={errorTitleStyle}>Commande introuvable</h4>
          <p style={errorDescStyle}>{error}</p>
          <Button variant="outline" size="sm" onClick={handleBackToList} style={{ marginTop: '8px' }}>
            Voir mes commandes enregistrées
          </Button>
        </div>
      )}

      {/* 4. VUE DÉTAILLÉE DE LA COMMANDE SÉLECTIONNÉE */}
      {!isLoading && !error && order && (
        <OrderDetailView
          order={order}
          onBack={handleBackToList}
          onRefresh={() => fetchOrder(activeIdentifier)}
          onUpdateOrder={setOrder}
        />
      )}

      {/* 5. VUE LISTE DE L'HISTORIQUE (SI AUCUNE COMMANDE SÉLECTIONNÉE) */}
      {!isLoading && !order && !error && (
        <OrderHistoryList
          orders={orderHistory}
          onSelectOrder={handleSelectOrder}
          onClearHistory={handleClearHistory}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingBottom: '30px'
};

const centerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px 20px',
  gap: '8px'
};

const errorCardStyle = {
  padding: '30px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '10px'
};

const errorTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const errorDescStyle = {
  fontSize: '0.84rem',
  color: 'var(--text-secondary)',
  maxWidth: '300px'
};
