/**
 * Tableau de bord spécialisé pour les livreurs (DriverDashboard).
 * Gestion de disponibilité, acceptation concurrente de courses et guidage d'itinéraire.
 */

import React, { useEffect, useState } from 'react';
import { Bike, Navigation, Phone, CheckCircle2, RefreshCw, Power, MapPin, Package } from 'lucide-react';
import { apiClient } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const DriverDashboardPage = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const [driverStatus, setDriverStatus] = useState(user?.driverStatus || 'AVAILABLE');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/driver/dashboard');
      if (res.success && res.data) {
        setActiveDeliveries(res.data.activeDeliveries || []);
        setAvailableOrders(res.data.availableOrders || []);
      }
    } catch (err) {
      showError(err.message || 'Erreur lors du chargement des courses.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleStatus = async (newStatus) => {
    try {
      const res = await apiClient.patch('/driver/status', { status: newStatus });
      if (res.success) {
        setDriverStatus(newStatus);
        showSuccess(`Statut mis à jour : ${newStatus === 'AVAILABLE' ? 'En ligne' : 'Hors ligne'}`);
      }
    } catch (err) {
      showError(err.message || 'Impossible de mettre à jour votre statut.');
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const res = await apiClient.post(`/driver/orders/${orderId}/accept`);
      if (res.success) {
        showSuccess('Course acceptée ! Rendez-vous au restaurant pour récupérer le repas.');
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || 'Cette commande a déjà été attribuée.');
      fetchDashboardData();
    }
  };

  const handleOrderAction = async (orderId, endpoint, successMsg) => {
    try {
      const res = await apiClient.post(`/driver/orders/${orderId}/${endpoint}`);
      if (res.success) {
        showSuccess(successMsg);
        fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || 'Erreur lors du changement de statut.');
    }
  };

  const openNavigation = (coords) => {
    if (coords && coords.length === 2) {
      const [lng, lat] = coords;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      {/* 1. EN-TÊTE LIVREUR & STATUT */}
      <div className="card-surface" style={headerCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>Espace Livreur</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Bonjour, {user?.firstName}</h3>
          </div>
          <button onClick={logout} style={logoutBtnStyle} title="Déconnexion">
            <Power size={18} color="#DC2626" />
          </button>
        </div>

        <div style={statusToggleRowStyle}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Disponibilité :</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['AVAILABLE', 'OFFLINE'].map((st) => (
              <button
                key={st}
                onClick={() => handleToggleStatus(st)}
                style={{
                  ...statusBtnStyle,
                  backgroundColor: driverStatus === st ? (st === 'AVAILABLE' ? '#16A34A' : '#64748B') : 'var(--bg-elevated)',
                  color: driverStatus === st ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                {st === 'AVAILABLE' ? 'En ligne' : 'Hors ligne'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. COURSES EN COURS */}
      {activeDeliveries.length > 0 && (
        <div style={sectionStyle}>
          <h4 style={sectionTitleStyle}>Votre Course Active</h4>
          {activeDeliveries.map((delivery) => (
            <div key={delivery._id} className="card-surface" style={deliveryCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={orderBadgeStyle}>{delivery.orderNumber}</span>
                <span style={statBadgeStyle}>{delivery.status}</span>
              </div>

              <div style={infoGroupStyle}>
                <p style={{ fontWeight: 800, fontSize: '0.96rem' }}>{delivery.customer.name}</p>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{delivery.delivery.address}</p>
              </div>

              <div style={actionRowStyle}>
                <a href={`tel:${delivery.customer.phone}`} style={callBtnStyle}>
                  <Phone size={16} /> Appeler le client
                </a>
                <button
                  onClick={() => openNavigation(delivery.delivery.location?.coordinates)}
                  style={navBtnStyle}
                >
                  <Navigation size={16} /> Itinéraire
                </button>
              </div>

              {delivery.status === 'ASSIGNED' && (
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => handleOrderAction(delivery._id, 'picked-up', 'Repas récupéré !')}
                  icon={Package}
                  style={{ marginTop: '8px' }}
                >
                  Je récupère la commande
                </Button>
              )}

              {delivery.status === 'PICKED_UP' && (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => handleOrderAction(delivery._id, 'out-for-delivery', 'En route vers le client !')}
                  icon={Bike}
                  style={{ marginTop: '8px' }}
                >
                  Démarrer la livraison
                </Button>
              )}

              {delivery.status === 'OUT_FOR_DELIVERY' && (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => handleOrderAction(delivery._id, 'delivered', 'Course confirmée et terminée !')}
                  icon={CheckCircle2}
                  style={{ marginTop: '8px', backgroundColor: '#16A34A' }}
                >
                  Confirmer la livraison
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. COMMANDES DISPONIBLES */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 style={sectionTitleStyle}>Commandes Disponibles ({availableOrders.length})</h4>
          <button onClick={fetchDashboardData} style={{ padding: '6px', color: 'var(--text-muted)' }}>
            <RefreshCw size={16} />
          </button>
        </div>

        {availableOrders.length === 0 ? (
          <div className="card-surface" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.86rem' }}>Aucune commande en attente de livraison pour le moment.</p>
          </div>
        ) : (
          availableOrders.map((ord) => (
            <div key={ord._id} className="card-surface" style={availableCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={orderBadgeStyle}>{ord.orderNumber}</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{ord.total?.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {ord.delivery.address}
              </p>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => handleAcceptOrder(ord._id)}
                style={{ marginTop: '10px' }}
              >
                Accepter la livraison
              </Button>
            </div>
          ))
        )}
      </div>
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

const headerCardStyle = {
  padding: '18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const logoutBtnStyle = {
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)'
};

const statusToggleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '10px',
  borderTop: '1px solid var(--border-color)'
};

const statusBtnStyle = {
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '0.78rem',
  fontWeight: 700,
  border: '1px solid var(--border-color)'
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const sectionTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text-primary)'
};

const deliveryCardStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  border: '1.5px solid var(--color-secondary)'
};

const availableCardStyle = {
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginBottom: '10px'
};

const orderBadgeStyle = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: 'var(--color-primary)'
};

const statBadgeStyle = {
  fontSize: '0.72rem',
  fontWeight: 800,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: 'var(--color-accent-surface)',
  color: 'var(--color-accent-dark)'
};

const infoGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px'
};

const actionRowStyle = {
  display: 'flex',
  gap: '8px'
};

const callBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  backgroundColor: 'var(--color-accent)',
  color: '#FFFFFF',
  padding: '9px 12px',
  borderRadius: '10px',
  fontSize: '0.82rem',
  fontWeight: 700,
  textDecoration: 'none'
};

const navBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  backgroundColor: 'var(--bg-elevated)',
  border: '1.5px solid var(--border-color)',
  color: 'var(--text-primary)',
  padding: '9px 12px',
  borderRadius: '10px',
  fontSize: '0.82rem',
  fontWeight: 700
};
