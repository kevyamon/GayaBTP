import React, { useState } from 'react';
import { LayoutDashboard, FileText, Building, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardOverviewTab } from '../components/dashboard/DashboardOverviewTab';
import { DashboardListingsTab } from '../components/dashboard/DashboardListingsTab';
import { DashboardProTab } from '../components/dashboard/DashboardProTab';

type DashboardTab = 'overview' | 'listings' | 'pro';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const isPro = user?.role === 'professionnel';

  const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
    { id: 'listings', label: 'Mes Annonces', icon: FileText },
    ...(isPro ? [{ id: 'pro' as DashboardTab, label: 'Espace Professionnel', icon: Building }] : []),
  ];

  return (
    <div className="min-h-screen pt-4 sm:pt-6 pb-36 sm:pb-40 lg:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Bouton Retour Rapide à l'Accueil */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      {/* 1. En-tête Utilisateur / Pro avec Bannière Couverture */}
      <DashboardHeader />

      {/* 2. Navigation des Onglets */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-brand-light-border dark:border-brand-dark-border pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-dark-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Contenu de l'Onglet Actif */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'overview' && <DashboardOverviewTab />}
        {activeTab === 'listings' && <DashboardListingsTab />}
        {activeTab === 'pro' && isPro && <DashboardProTab />}
      </div>
    </div>
  );
};
