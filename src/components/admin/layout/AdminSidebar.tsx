import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  CreditCard,
  Users,
  Key,
  FileText,
} from 'lucide-react';
import { AdminSection } from '../../../hooks/useAdminData';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  pendingCounts?: {
    listings?: number;
    verifications?: number;
    payments?: number;
  };
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  badgeCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  pendingCounts,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'kpis',
      label: 'Vue d’ensemble',
      icon: LayoutDashboard,
    },
    {
      id: 'listings',
      label: 'Modération Annonces',
      icon: MapPin,
      badgeCount: pendingCounts?.listings,
    },
    {
      id: 'verifications',
      label: 'Certification Pros',
      icon: ShieldCheck,
      badgeCount: pendingCounts?.verifications,
    },
    {
      id: 'payments',
      label: 'Paiements & Abonnements',
      icon: CreditCard,
      badgeCount: pendingCounts?.payments,
    },
    {
      id: 'users',
      label: 'Gestion Utilisateurs',
      icon: Users,
    },
    {
      id: 'admins',
      label: 'Équipe & Invitations',
      icon: Key,
    },
    {
      id: 'audit',
      label: 'Journal d’Audit',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md lg:border-r border-slate-200/80 dark:border-white/10 p-3 lg:p-4">
      {/* Navigation Desktop Verticale */}
      <nav className="hidden lg:flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md scale-[1.01]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-secondary dark:text-brand-primary' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {Boolean(item.badgeCount && item.badgeCount > 0) && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-brand-secondary text-white'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Navigation Mobile / Tablette Horizontale Défilable */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {Boolean(item.badgeCount && item.badgeCount > 0) && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
