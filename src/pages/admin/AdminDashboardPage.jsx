/**
 * Tableau de bord administrateur (AdminDashboardPage).
 * Orchestrateur modulaire mobile-first avec réactivité temps réel Socket.IO.
 */

import React, { useEffect, useState } from 'react';
import { applyTheme } from '../../styles/theme';
import { useAdminData } from './hooks/useAdminData';

import { AdminHeader } from './components/AdminHeader';
import { AdminTabBar } from './components/AdminTabBar';
import { AdminSectionRouter } from './components/AdminSectionRouter';
import { AdminOrderDetailsModal } from './components/AdminOrderDetailsModal';
import { DishEditModal } from './components/DishEditModal';
import { NotificationPermissionBanner } from '../../components/ui/NotificationPermissionBanner';

export const AdminDashboardPage = () => {
  const [activeSection, setActiveSection] = useState('kpis');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('rb_theme') === 'dark');

  // Modales
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const adminData = useAdminData();

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem('rb_theme', nextDark ? 'dark' : 'light');
    applyTheme(nextDark);
  };

  useEffect(() => {
    applyTheme(isDark);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="animate-fade-in" style={contentWrapperStyle}>
        <AdminHeader
          restaurantSettings={adminData.settings}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onToggleStoreStatus={adminData.toggleStoreStatus}
          isUpdatingStore={adminData.isUpdatingStore}
        />

        {/* Bannière de notifications push pour l'administration */}
        <NotificationPermissionBanner role="ADMIN" />

        <main style={{ minHeight: '50vh' }}>
          <AdminSectionRouter
            activeSection={activeSection}
            dashboardData={adminData.dashboardData}
            orders={adminData.orders}
            dishes={adminData.dishes}
            categories={adminData.categories}
            drivers={adminData.drivers}
            auditLogs={adminData.auditLogs}
            settings={adminData.settings}
            isLoading={adminData.isLoading}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onUpdateOrderStatus={adminData.updateOrderStatus}
            onOpenCreateDish={() => {
              setSelectedDish(null);
              setIsDishModalOpen(true);
            }}
            onOpenEditDish={(d) => {
              setSelectedDish(d);
              setIsDishModalOpen(true);
            }}
            onToggleAvailability={adminData.toggleDishAvailability}
            onDeleteDish={adminData.deleteDish}
            onCreateDriver={adminData.createDriver}
            onSaveSettings={adminData.saveSettings}
          />
        </main>
      </div>

      <AdminTabBar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        pendingOrdersCount={adminData.dashboardData?.kpi?.pendingCount || 0}
      />

      {selectedOrder && (
        <AdminOrderDetailsModal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          order={selectedOrder}
          drivers={adminData.drivers}
          onUpdateStatus={adminData.updateOrderStatus}
        />
      )}

      <DishEditModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        dish={selectedDish}
        categories={adminData.categories}
        onSaveDish={adminData.saveDish}
      />
    </div>
  );
};

const containerStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
  maxWidth: '720px',
  margin: '0 auto',
  width: '100%',
  position: 'relative'
};

const contentWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%'
};


