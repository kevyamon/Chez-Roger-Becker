/**
 * Application principale Chez Roger Becker (App).
 * Orchestre le routage d'écran, le chargement de données et les modales de plats.
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from './services/api';
import { socket } from './services/socket';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useToast } from './context/ToastContext';

// Composants Layout & UI
import { Header } from './components/layout/Header';
import { TabBar } from './components/layout/TabBar';
import { DishDetailModal } from './components/menu/DishDetailModal';

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
  const { showSuccess, showInfo } = useToast();

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

  // Initialisation du thème sauvegardé
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

  // Synchronisation temps réel Socket.IO (Public & PWA)
  useEffect(() => {
    const onRestaurantUpdate = (upd) => {
      setRestaurant((prev) => ({ ...prev, ...upd }));
      if (upd.deliveryFee !== undefined) setDeliveryFee(upd.deliveryFee);
    };

    const onDishCreated = (dish) => setDishes((prev) => [dish, ...prev.filter((d) => d._id !== dish._id)]);
    const onDishUpdated = (dish) => {
      setDishes((prev) => prev.map((d) => (d._id === dish._id ? { ...d, ...dish } : d)));
      setSelectedDish((prev) => (prev && prev._id === dish._id ? { ...prev, ...dish } : prev));
    };
    const onDishDeleted = ({ dishId }) => {
      setDishes((prev) => prev.filter((d) => d._id !== dishId));
      setSelectedDish((prev) => (prev && prev._id === dishId ? null : prev));
    };

    const onCatCreated = (cat) => setCategories((prev) => [...prev.filter((c) => c._id !== cat._id), cat]);
    const onCatUpdated = (cat) => setCategories((prev) => prev.map((c) => (c._id === cat._id ? { ...c, ...cat } : c)));
    const onCatDeleted = ({ categoryId }) => setCategories((prev) => prev.filter((c) => c._id !== categoryId));

    const onPromoCreated = (p) => setPromotions((prev) => [p, ...prev.filter((item) => item._id !== p._id)]);
    const onPromoUpdated = (p) => setPromotions((prev) => prev.map((item) => (item._id === p._id ? { ...item, ...p } : item)));
    const onPromoDeleted = ({ promoId }) => setPromotions((prev) => prev.filter((item) => item._id !== promoId));

    const onOrderStatus = (data) => {
      try {
        const history = JSON.parse(localStorage.getItem('rb_orders_history') || '[]');
        const match = history.find((o) => o.trackingToken === data.trackingToken || o.orderNumber === data.orderNumber);
        if (match) {
          const updated = history.map((o) => (o.trackingToken === data.trackingToken || o.orderNumber === data.orderNumber ? { ...o, status: data.status } : o));
          localStorage.setItem('rb_orders_history', JSON.stringify(updated));
          showInfo(`Votre commande #${data.orderNumber || match.orderNumber} : ${data.status}`);
        }
      } catch {
        // Ignorer erreur JSON
      }
    };

    socket.on('restaurant:updated', onRestaurantUpdate);
    socket.on('dish:created', onDishCreated);
    socket.on('dish:updated', onDishUpdated);
    socket.on('dish:deleted', onDishDeleted);
    socket.on('category:created', onCatCreated);
    socket.on('category:updated', onCatUpdated);
    socket.on('category:deleted', onCatDeleted);
    socket.on('promotion:created', onPromoCreated);
    socket.on('promotion:updated', onPromoUpdated);
    socket.on('promotion:deleted', onPromoDeleted);
    socket.on('order:status-changed', onOrderStatus);

    return () => {
      socket.off('restaurant:updated', onRestaurantUpdate);
      socket.off('dish:created', onDishCreated);
      socket.off('dish:updated', onDishUpdated);
      socket.off('dish:deleted', onDishDeleted);
      socket.off('category:created', onCatCreated);
      socket.off('category:updated', onCatUpdated);
      socket.off('category:deleted', onCatDeleted);
      socket.off('promotion:created', onPromoCreated);
      socket.off('promotion:updated', onPromoUpdated);
      socket.off('promotion:deleted', onPromoDeleted);
      socket.off('order:status-changed', onOrderStatus);
    };
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

      <DishDetailModal
        dish={selectedDish}
        quantity={selectedDishQty}
        onClose={() => setSelectedDish(null)}
        onChangeQuantity={setSelectedDishQty}
        onAddToCart={handleAddModalDish}
      />
    </div>
  );
}

