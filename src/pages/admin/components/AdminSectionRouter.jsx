import React from 'react';
import { AdminKpiSection } from './AdminKpiSection';
import { AdminOrdersSection } from './AdminOrdersSection';
import { AdminMenuSection } from './AdminMenuSection';
import { AdminPromotionsSection } from './AdminPromotionsSection';
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
  promotions = [],
  isLoading,
  isLoadingPromos = false,
  onSelectOrder,
  onUpdateOrderStatus,
  onOpenCreateDish,
  onOpenEditDish,
  onToggleAvailability,
  onDeleteDish,
  onCreateDriver,
  onUpdateDriver,
  onDeleteDriver,
  onSaveSettings,
  onSavePromotion,
  onTogglePromotionStatus,
  onDeletePromotion
}) => {
  switch (activeSection) {
    case 'kpis':
      return <AdminKpiSection dashboardData={dashboardData} onSelectOrder={onSelectOrder} isLoading={isLoading} />;
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
          isLoading={isLoading}
        />
      );
    case 'promos':
      return (
        <AdminPromotionsSection
          promotions={promotions}
          dishes={dishes}
          isLoading={isLoadingPromos}
          onSavePromotion={onSavePromotion}
          onToggleStatus={onTogglePromotionStatus}
          onDeletePromotion={onDeletePromotion}
        />
      );
    case 'drivers':
      return (
        <AdminDriversSection
          drivers={drivers}
          onCreateDriver={onCreateDriver}
          onUpdateDriver={onUpdateDriver}
          onDeleteDriver={onDeleteDriver}
          isLoading={isLoading}
        />
      );
    case 'settings':
      return <AdminSettingsSection settings={settings} onSaveSettings={onSaveSettings} isLoading={isLoading} />;
    default:
      return <AdminKpiSection dashboardData={dashboardData} onSelectOrder={onSelectOrder} isLoading={isLoading} />;
  }
};

