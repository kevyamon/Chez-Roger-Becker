/**
 * Tableau de bord administrateur (AdminDashboardPage).
 * Orchestrateur modulaire mobile-first reliant les vues d'indicateurs, commandes, menu, livreurs et reglages.
 */

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { applyTheme } from '../../styles/theme';

import { AdminHeader } from './components/AdminHeader';
import { AdminNavTabs } from './components/AdminNavTabs';
import { AdminKpiSection } from './components/AdminKpiSection';
import { AdminOrdersSection } from './components/AdminOrdersSection';
import { AdminOrderDetailsModal } from './components/AdminOrderDetailsModal';
import { AdminMenuSection } from './components/AdminMenuSection';
import { DishEditModal } from './components/DishEditModal';
import { AdminDriversSection } from './components/AdminDriversSection';
import { AdminSettingsSection } from './components/AdminSettingsSection';
import { AdminAuditSection } from './components/AdminAuditSection';

export const AdminDashboardPage = () => {
  const { showSuccess, showError } = useToast();

  const [activeSection, setActiveSection] = useState('kpis');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('rb_theme') === 'dark');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);

  // Etats des donnees
  const [dashboardData, setDashboardData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modales
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  // Bascule du theme Jour / Nuit
  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem('rb_theme', nextDark ? 'dark' : 'light');
    applyTheme(nextDark);
  };

  const fetchAllAdminData = async () => {
    try {
      setIsLoading(true);
      const [dashRes, setRes, ordersRes, dishesRes, catRes, driversRes, auditRes] = await Promise.all([
        apiClient.get('/admin/dashboard'),
        apiClient.get('/admin/settings'),
        apiClient.get('/admin/orders'),
        apiClient.get('/admin/dishes'),
        apiClient.get('/admin/categories'),
        apiClient.get('/admin/drivers'),
        apiClient.get('/admin/audit-logs')
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (setRes.success) setSettings(setRes.data?.settings);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (dishesRes.success) setDishes(dishesRes.data || []);
      if (catRes.success) setCategories(catRes.data?.categories || []);
      if (driversRes.success) setDrivers(driversRes.data?.drivers || []);
      if (auditRes.success) setAuditLogs(auditRes.data || []);
    } catch (err) {
      showError(err.message || 'Erreur de chargement des données.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
    applyTheme(isDark);
  }, []);

  const handleToggleStoreStatus = async () => {
    if (!settings) return;
    try {
      setIsUpdatingStore(true);
      const newStatus = !settings.isOpen;
      const res = await apiClient.patch('/admin/settings', { isOpen: newStatus });
      if (res.success) {
        setSettings({ ...settings, isOpen: newStatus });
        showSuccess(`Le restaurant est désormais ${newStatus ? 'Ouvert aux commandes' : 'Fermé'}.`);
      }
    } catch (err) {
      showError(err.message || 'Échec de mise à jour du statut.');
    } finally {
      setIsUpdatingStore(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        showSuccess(`Statut mis à jour : ${newStatus}`);
        fetchAllAdminData();
      }
    } catch (err) {
      showError(err.message || 'Échec du changement de statut.');
    }
  };

  const handleSaveDish = async (dishData) => {
    try {
      if (dishData._id) {
        await apiClient.patch(`/admin/dishes/${dishData._id}`, dishData);
        showSuccess('Plat mis à jour avec succès.');
      } else {
        await apiClient.post('/admin/dishes', dishData);
        showSuccess('Nouveau plat ajouté au menu.');
      }
      fetchAllAdminData();
    } catch (err) {
      showError(err.message || 'Erreur lors de l\'enregistrement du plat.');
    }
  };

  const handleToggleDishAvailability = async (dishId, isAvailable) => {
    try {
      await apiClient.patch(`/admin/dishes/${dishId}`, { isAvailable });
      setDishes((prev) => prev.map((d) => (d._id === dishId ? { ...d, isAvailable } : d)));
      showSuccess(`Plat marqué comme ${isAvailable ? 'Disponible' : 'Épuisé'}.`);
    } catch (err) {
      showError(err.message || 'Échec de modification de la disponibilité.');
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await apiClient.delete(`/admin/dishes/${dishId}`);
      setDishes((prev) => prev.filter((d) => d._id !== dishId));
      showSuccess('Plat retiré de la carte avec succès.');
    } catch (err) {
      showError(err.message || 'Erreur lors de la suppression.');
    }
  };

  const handleCreateDriver = async (driverData) => {
    try {
      const res = await apiClient.post('/admin/drivers', driverData);
      if (res.success && res.data?.driver) {
        setDrivers((prev) => [res.data.driver, ...prev]);
        showSuccess('Compte livreur créé avec succès.');
      }
    } catch (err) {
      showError(err.message || 'Échec de création du livreur.');
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await apiClient.patch('/admin/settings', newSettings);
      if (res.success) {
        setSettings(res.data?.settings);
        showSuccess('Paramètres du restaurant mis à jour.');
      }
    } catch (err) {
      showError(err.message || 'Erreur lors de la sauvegarde des paramètres.');
    }
  };

  return (
    <div className="animate-fade-in" style={containerStyle}>
      <AdminHeader
        restaurantSettings={settings}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onToggleStoreStatus={handleToggleStoreStatus}
        isUpdatingStore={isUpdatingStore}
      />

      <AdminNavTabs
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        pendingOrdersCount={dashboardData?.kpi?.pendingCount || 0}
      />

      <main style={{ minHeight: '50vh' }}>
        {activeSection === 'kpis' && (
          <AdminKpiSection
            dashboardData={dashboardData}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
          />
        )}

        {activeSection === 'orders' && (
          <AdminOrdersSection
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            isLoading={isLoading}
          />
        )}

        {activeSection === 'menu' && (
          <AdminMenuSection
            dishes={dishes}
            categories={categories}
            onOpenCreateDish={() => {
              setSelectedDish(null);
              setIsDishModalOpen(true);
            }}
            onOpenEditDish={(d) => {
              setSelectedDish(d);
              setIsDishModalOpen(true);
            }}
            onToggleAvailability={handleToggleDishAvailability}
            onDeleteDish={handleDeleteDish}
          />
        )}

        {activeSection === 'drivers' && (
          <AdminDriversSection
            drivers={drivers}
            onCreateDriver={handleCreateDriver}
            isLoading={isLoading}
          />
        )}

        {activeSection === 'settings' && (
          <AdminSettingsSection
            settings={settings}
            onSaveSettings={handleSaveSettings}
            isLoading={isLoading}
          />
        )}

        {activeSection === 'audit' && (
          <AdminAuditSection
            auditLogs={auditLogs}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Modale Details Commande */}
      {selectedOrder && (
        <AdminOrderDetailsModal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          drivers={drivers}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

      {/* Modale Edition / Creation Plat */}
      <DishEditModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        dish={selectedDish}
        categories={categories}
        onSaveDish={handleSaveDish}
      />
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  paddingBottom: '40px',
  maxWidth: '720px',
  margin: '0 auto'
};
