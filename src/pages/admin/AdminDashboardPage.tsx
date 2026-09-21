import React from 'react';
import { AdminAuthGuard } from '../../components/admin/layout/AdminAuthGuard';
import { AdminHeader } from '../../components/admin/layout/AdminHeader';
import { AdminSidebar } from '../../components/admin/layout/AdminSidebar';
import { useAdminData } from '../../hooks/useAdminData';

// Les 7 Sections Métiers du Back-Office
import { AdminKpiSection } from '../../components/admin/sections/AdminKpiSection';
import { AdminListingsSection } from '../../components/admin/sections/AdminListingsSection';
import { AdminVerificationsSection } from '../../components/admin/sections/AdminVerificationsSection';
import { AdminPaymentsSection } from '../../components/admin/sections/AdminPaymentsSection';
import { AdminUsersSection } from '../../components/admin/sections/AdminUsersSection';
import { AdminTeamSection } from '../../components/admin/sections/AdminTeamSection';
import { AdminAuditLogsSection } from '../../components/admin/sections/AdminAuditLogsSection';

export const AdminDashboardPage: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    stats,
    isLoadingStats,
    refreshStats,
  } = useAdminData();

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col bg-brand-light dark:bg-brand-dark text-slate-900 dark:text-slate-100 transition-colors selection:bg-brand-secondary selection:text-white">
        {/* Barre de supervision supérieure */}
        <AdminHeader onRefresh={refreshStats} isRefreshing={isLoadingStats} />

        {/* Disposition Principale : Barre Latérale + Section Active */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
          <AdminSidebar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            pendingCounts={{
              listings: stats?.totalListings,
              verifications: stats?.pendingVerifications,
              payments: stats?.pendingPayments,
            }}
          />

          {/* Aiguilleur d'affichage des 7 domaines métiers */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeSection === 'kpis' && (
              <AdminKpiSection
                stats={stats}
                isLoading={isLoadingStats}
                onNavigateSection={setActiveSection}
              />
            )}

            {activeSection === 'listings' && <AdminListingsSection />}

            {activeSection === 'verifications' && <AdminVerificationsSection />}

            {activeSection === 'payments' && <AdminPaymentsSection />}

            {activeSection === 'users' && <AdminUsersSection />}

            {activeSection === 'admins' && <AdminTeamSection />}

            {activeSection === 'audit' && <AdminAuditLogsSection />}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
};
