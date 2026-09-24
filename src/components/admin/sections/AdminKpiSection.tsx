import React from 'react';
import {
  Wallet,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  Bell,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardStats } from '../../../services/admin.service';
import { AdminSection } from '../../../hooks/useAdminData';


interface AdminKpiSectionProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onNavigateSection: (section: AdminSection) => void;
}

export const AdminKpiSection: React.FC<AdminKpiSectionProps> = ({
  stats,
  isLoading,
  onNavigateSection,
}) => {
  const cards = [
    {
      title: 'Chiffre d’Affaires Réalisé',
      value: `${(stats?.totalRevenueFCFA || 0).toLocaleString('fr-FR')} FCFA`,
      subtitle: 'Abonnements SaaS & Boosts encaissés',
      icon: Wallet,
      colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      actionSection: 'payments' as AdminSection,
    },
    {
      title: 'Dossiers Pros à Vérifier',
      value: stats?.pendingVerifications || 0,
      subtitle: 'Attribution du Badge Vérifié',
      icon: ShieldCheck,
      colorClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      actionSection: 'verifications' as AdminSection,
      highlight: (stats?.pendingVerifications || 0) > 0,
    },
    {
      title: 'Annonces Foncières Actives',
      value: stats?.totalListings || 0,
      subtitle: 'Terrains & projets BTP en ligne',
      icon: MapPin,
      colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
      actionSection: 'listings' as AdminSection,
    },
    {
      title: 'Abonnements SaaS Actifs',
      value: stats?.activeSubscriptions || 0,
      subtitle: 'Formules Starter, Pro et Premium',
      icon: TrendingUp,
      colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      actionSection: 'payments' as AdminSection,
    },
    {
      title: 'Utilisateurs Enregistrés',
      value: stats?.totalUsers || 0,
      subtitle: `Dont ${stats?.totalPros || 0} professionnels labellisés`,
      icon: Users,
      colorClass: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20',
      actionSection: 'users' as AdminSection,
    },
    {
      title: 'Alertes Foncières Actives',
      value: stats?.activeAlerts || 0,
      subtitle: `${stats?.totalJobs || 0} offres de recrutement BTP`,
      icon: Bell,
      colorClass: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Tableau de Bord Exécutif
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supervision globale de l’écosystème numérique Foncier & BTP en Côte d’Ivoire
          </p>
        </div>
      </div>

      {/* Alertes d'actions prioritaires si éléments en attente */}
      {Boolean((stats?.pendingVerifications || 0) > 0) && (
        <div className="flex items-center justify-between p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              <span className="font-bold">{stats?.pendingVerifications} dossier(s) professionnel(s)</span> en attente de vérification des pièces légales.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateSection('verifications')}
            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer"
          >
            Examiner
          </button>
        </div>
      )}

      {/* Grille des Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden p-5 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm transition-all hover:shadow-md ${
                card.actionSection ? 'cursor-pointer group' : ''
              }`}
              onClick={() => card.actionSection && onNavigateSection(card.actionSection)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isLoading ? '...' : card.value}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border ${card.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {card.actionSection && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-brand-secondary group-hover:text-brand-secondary-hover">
                  <span>Accéder à la section</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
