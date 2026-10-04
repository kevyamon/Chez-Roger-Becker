import React from 'react';
import { AdminKpiSection } from './AdminKpiSection';
import { AdminOrdersSection } from './AdminOrdersSection';
import { AdminOrdersHistorySection } from './AdminOrdersHistorySection';
import { AdminMenuSection } from './AdminMenuSection';
import { AdminPromotionsSection } from './AdminPromotionsSection';
import { AdminDriversSection } from './AdminDriversSection';
import { AdminAuditSection } from './AdminAuditSection';
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
  auditLogs = [],
  isLoading,
  isLoadingPromos = false,
  isLoadingAudit = false,
  onSelectOrder,
  onUpdateOrderStatus,
  onArchiveOrder,
  onUnarchiveOrder,
  onDeleteOrder,
  onArchiveCompletedOrders,
  onDeleteLog,
  onClearLogs,
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
      return (
        <AdminKpiSection
          dashboardData={dashboardData}
          onSelectOrder={onSelectOrder}
          onArchiveOrder={onArchiveOrder}
          isLoading={isLoading}
        />
      );
    case 'orders':
      return (
        <AdminOrdersSection
          orders={orders}
          onUpdateStatus={onUpdateOrderStatus}
          onSelectOrder={onSelectOrder}
          onArchiveOrder={onArchiveOrder}
          onUnarchiveOrder={onUnarchiveOrder}
          onDeleteOrder={onDeleteOrder}
          onArchiveCompletedOrders={onArchiveCompletedOrders}
          isLoading={isLoading}
        />
      );
    case 'history':
      return <AdminOrdersHistorySection />;
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
    case 'audit':
      return (
        <AdminAuditSection
          auditLogs={auditLogs}
          isLoading={isLoadingAudit}
          onDeleteLog={onDeleteLog}
          onClearLogs={onClearLogs}
        />
      );
    case 'settings':
      return <AdminSettingsSection settings={settings} onSaveSettings={onSaveSettings} isLoading={isLoading} />;
    default:
      return (
        <AdminKpiSection
          dashboardData={dashboardData}
          onSelectOrder={onSelectOrder}
          onArchiveOrder={onArchiveOrder}
          isLoading={isLoading}
        />
      );
  }
};
