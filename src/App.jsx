/**
 * Application principale Chez Roger Becker (App).
 * Orchestre le routage d'écran, le chargement résilient, la persistance de session et les modales.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useToast } from './context/ToastContext';
import { useAppStartup } from './hooks/useAppStartup';
import { useRestaurantData } from './hooks/useRestaurantData';
import { storageAdapter } from './utils/storageAdapter';

// Composants Layout & UI
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { DishDetailModal } from './components/menu/DishDetailModal';
import { PwaInstallBanner } from './components/ui/PwaInstallBanner';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

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

export function App() {
  const { isAuthenticated, isAdmin, isDriver, isLoading: isAuthLoading } = useAuth();
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  useAppStartup();

  const {
    categories,
    dishes,
    promotions,
    restaurant,
    isLoading: isDataLoading,
    isServerWaking
  } = useRestaurantData();

  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/admin') || path.includes('/dashboard') || path.includes('/backoffice')) {
      return 'notfound';
    }
    return sessionStorage.getItem('rb_active_tab') || 'home';
  });

  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedDishQty, setSelectedDishQty] = useState(1);
  const [trackingToken, setTrackingToken] = useState(() => storageAdapter.getTrackingToken());

  const handleNavigate = (tab, replace = false) => {
    if (tab !== activeTab) {
      if (replace) {
        window.history.replaceState({ tab }, '', `#${tab === 'home' ? '' : tab}`);
      } else {
        window.history.pushState({ tab }, '', `#${tab === 'home' ? '' : tab}`);
      }
    }
    setActiveTab(tab);
    sessionStorage.setItem('rb_active_tab', tab);
  };

  // Synchronisation avec l'historique et le bouton retour physique
  useEffect(() => {
    window.history.replaceState({ tab: activeTab }, '', `#${activeTab === 'home' ? '' : activeTab}`);

    const handlePopState = (e) => {
      const target = e.state?.tab || window.location.hash.replace('#', '') || 'home';
      setActiveTab(target);
      sessionStorage.setItem('rb_active_tab', target);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Défilement en haut de page à chaque changement d'onglet
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

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
    storageAdapter.setTrackingToken(token);
    handleNavigate('track');
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
            isLoading={isDataLoading}
            isServerWaking={isServerWaking}
            onNavigate={handleNavigate}
            onSelectDish={handleSelectDish}
          />
        );
      case 'menu':
        return (
          <MenuPage
            dishes={dishes}
            categories={categories}
            isLoading={isDataLoading}
            isServerWaking={isServerWaking}
            onSelectDish={handleSelectDish}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} onOrderSuccess={handleOrderSuccess} />;
      case 'track':
        return <OrderTrackingPage trackingToken={trackingToken} onNavigate={handleNavigate} />;
      case 'auth-admin':
      case 'driver-login':
      case 'auth': {
        if (isAuthLoading && !isAuthenticated) {
          return (
            <LoadingSpinner
              message="Chargement de votre session..."
              subMessage="Vérification sécurisée de vos accès en cours..."
            />
          );
        }
        if (isAuthenticated) {
          if (isAdmin) return <AdminDashboardPage />;
          if (isDriver) return <DriverDashboardPage />;
        }
        const targetRole = activeTab === 'driver-login' ? 'driver' : 'admin';
        return <LoginPage authRole={targetRole} onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate(activeTab)} />;
      }
      case 'notfound':
        return <NotFoundPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isProFlow = ['auth', 'auth-admin', 'driver-login', 'notfound'].includes(activeTab);

  return (
    <div className="app-container">
      {!isProFlow && (
        <Header restaurantInfo={restaurant} onNavigate={handleNavigate} onOpenMenu={() => handleNavigate('menu')} />
      )}

      <main style={{ flex: 1 }}>{renderActiveScreen()}</main>

      {!isProFlow && (
        <TabBar activeTab={activeTab} onSelectTab={handleNavigate} />
      )}

      <DishDetailModal
        dish={selectedDish}
        quantity={selectedDishQty}
        onClose={() => setSelectedDish(null)}
        onChangeQuantity={setSelectedDishQty}
        onAddToCart={handleAddModalDish}
      />

      <PwaInstallBanner />
    </div>
  );
}
