/**
 * Aiguilleur d'affichage des sections du dashboard administrateur (AdminSectionRouter).
 */

import React from 'react';
import { AdminKpiSection } from './AdminKpiSection';
import { AdminOrdersSection } from './AdminOrdersSection';
import { AdminMenuSection } from './AdminMenuSection';
import { AdminDriversSection } from './AdminDriversSection';
import { AdminSettingsSection } from './AdminSettingsSection';

export const AdminSectionRouter = ({
  activeSection,
  dashboardData,
  orders,
  dishes,
  categories,
  drivers,
  settings,
  isLoading,
  onSelectOrder,
  onUpdateOrderStatus,
  onOpenCreateDish,
  onOpenEditDish,
  onToggleAvailability,
  onDeleteDish,
  onCreateDriver,
  onSaveSettings
}) => {
  switch (activeSection) {
    case 'kpis':
      return <AdminKpiSection dashboardData={dashboardData} onSelectOrder={onSelectOrder} />;
    case 'orders':
      return (
        <AdminOrdersSection
          orders={orders}
          onUpdateStatus={onUpdateOrderStatus}
          onSelectOrder={onSelectOrder}
          isLoading={isLoading}
        />
      );
    case 'menu':
      return (
        <AdminMenuSection
          dishes={dishes}
          categories={categories}
          onOpenCreateDish={onOpenCreateDish}
          onOpenEditDish={onOpenEditDish}
          onToggleAvailability={onToggleAvailability}
          onDeleteDish={onDeleteDish}
        />
      );
    case 'drivers':
      return <AdminDriversSection drivers={drivers} onCreateDriver={onCreateDriver} isLoading={isLoading} />;
    case 'settings':
      return <AdminSettingsSection settings={settings} onSaveSettings={onSaveSettings} isLoading={isLoading} />;
    default:
      return <AdminKpiSection dashboardData={dashboardData} onSelectOrder={onSelectOrder} />;
  }
};
