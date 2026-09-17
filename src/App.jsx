/**
 * Application principale Chez Roger Becker (App).
 * Orchestre le routage d'écran, le chargement de données et les modales de plats.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from './services/api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useToast } from './context/ToastContext';

// Composants Layout & UI
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';

// Pages
import { HomePage } from './pages/public/HomePage';
import { MenuPage } from './pages/public/MenuPage';
import { CartPage } from './pages/public/CartPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { OrderTrackingPage } from './pages/public/OrderTrackingPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { DriverDashboardPage } from './pages/driver/DriverDashboardPage';
import { applyTheme } from './styles/theme';

export function App() {
  const { isAuthenticated, isAdmin, isDriver } = useAuth();
  const { addItem, setDeliveryFee } = useCart();
  const { showSuccess } = useToast();

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin') || path.includes('/dashboard') || path.includes('/backoffice')) {
      return 'notfound';
    }
    return 'home';
  });

  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [restaurant, setRestaurant] = useState({});
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedDishQty, setSelectedDishQty] = useState(1);
  const [trackingToken, setTrackingToken] = useState(() => localStorage.getItem('rb_last_tracking_token'));

  // Initialisation du theme sauvegarde
  useEffect(() => {
    const savedTheme = localStorage.getItem('rb_theme') === 'dark';
    applyTheme(savedTheme);
  }, []);

  // Chargement initial des données du restaurant
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, dishRes, promoRes, restRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/dishes'),
          apiClient.get('/promotions'),
          apiClient.get('/restaurant')
        ]);

        if (catRes.success) setCategories(catRes.data?.categories || []);
        if (dishRes.success) setDishes(dishRes.data?.dishes || []);
        if (promoRes.success) setPromotions(promoRes.data?.promotions || []);
        if (restRes.success && restRes.data?.restaurant) {
          setRestaurant(restRes.data.restaurant);
          if (restRes.data.restaurant.deliveryFee) {
            setDeliveryFee(restRes.data.restaurant.deliveryFee);
          }
        }
      } catch (err) {
        console.warn('Échec du chargement initial:', err.message);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectDish = (dish) => {
    setSelectedDish(dish);
    setSelectedDishQty(1);
  };

  const handleAddModalDish = () => {
    if (selectedDish) {
      addItem(selectedDish, selectedDishQty);
      showSuccess(`${selectedDish.name} ajouté au panier (${selectedDishQty}).`);
      setSelectedDish(null);
    }
  };

  const handleOrderSuccess = (token) => {
    setTrackingToken(token);
    localStorage.setItem('rb_last_tracking_token', token);
    setActiveTab('track');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            dishes={dishes}
            promotions={promotions}
            categories={categories}
            restaurant={restaurant}
            onNavigate={setActiveTab}
            onSelectDish={handleSelectDish}
          />
        );
      case 'menu':
        return (
          <MenuPage
            dishes={dishes}
            categories={categories}
            onSelectDish={handleSelectDish}
          />
        );
      case 'cart':
        return <CartPage onNavigate={setActiveTab} />;
      case 'checkout':
        return <CheckoutPage onNavigate={setActiveTab} onOrderSuccess={handleOrderSuccess} />;
      case 'track':
        return <OrderTrackingPage trackingToken={trackingToken} onNavigate={setActiveTab} />;
      case 'auth':
        if (isAuthenticated) {
          if (isAdmin) return <AdminDashboardPage />;
          if (isDriver) return <DriverDashboardPage />;
        }
        return <LoginPage onNavigate={setActiveTab} onLoginSuccess={() => setActiveTab('auth')} />;
      case 'notfound':
        return <NotFoundPage onNavigate={setActiveTab} />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  const isProFlow = activeTab === 'auth' || activeTab === 'notfound';

  return (
    <div className="app-container">
      {!isProFlow && (
        <Header restaurantInfo={restaurant} onOpenMenu={() => setActiveTab('menu')} />
      )}

      <main style={{ flex: 1 }}>{renderActiveScreen()}</main>

      {!isProFlow && (
        <TabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      )}

      {/* MODALE DE DÉTAIL DU PLAT */}
      {selectedDish && (
        <Modal
          isOpen={Boolean(selectedDish)}
          onClose={() => setSelectedDish(null)}
          title={selectedDish.name}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <img
              src={selectedDish.image}
              alt={selectedDish.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '14px' }}
            />
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {selectedDish.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {((selectedDish.promotionalPrice || selectedDish.price) * selectedDishQty).toLocaleString('fr-FR')} FCFA
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setSelectedDishQty((q) => Math.max(1, q - 1))}
                  style={modalQtyBtnStyle}
                >
                  -
                </button>
                <span style={{ fontWeight: 800 }}>{selectedDishQty}</span>
                <button
                  onClick={() => setSelectedDishQty((q) => q + 1)}
                  style={modalQtyBtnStyle}
                >
                  +
                </button>
              </div>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={handleAddModalDish}>
              Ajouter au panier
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const modalQtyBtnStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800
};
