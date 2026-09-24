import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Calculator,
  ShieldCheck,
  Users,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardOverviewTab: React.FC = () => {
  const { user, proProfile } = useAuth();
  const isPro = user?.role === 'professionnel';

  const quickActions = [
    {
      title: 'Publier une annonce',
      description: 'Mettez en vente ou location un terrain sécurisé ou un bien immobilier.',
      icon: PlusCircle,
      link: '/publier',
      color: 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-sky-300',
    },
    {
      title: 'Simulateur de Frais Foncier',
      description: 'Estimez avec précision les honoraires de notaire, droits DGI et mutation ACD.',
      icon: Calculator,
      link: '/calculateur',
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      title: 'Vérification Foncière & Cadastre',
      description: 'Accédez aux guichets officiels (IDUFCI, Livre Foncier, DGI) pour vos contrôles.',
      icon: ShieldCheck,
      link: '/verification',
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      title: 'Annuaire des Professionnels',
      description: 'Contactez des géomètres agréés, architectes et entreprises de construction.',
      icon: Users,
      link: '/pros',
      color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Grille des Cartes Statistiques / Informations Clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Carte 1 : Type de Compte */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Profil Actif
            </span>
            <span className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-sky-300">
              <FileText className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            {isPro ? (proProfile?.category || 'Professionnel BTP') : 'Acquéreur / Vendeur Particulier'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isPro ? `${proProfile?.specialties?.length || 1} spécialité(s) enregistrée(s)` : 'Accès complet aux annonces sécurisées'}
          </p>
        </div>

        {/* Carte 2 : Statut de Sécurité */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Statut de Sécurité
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-emerald-600 dark:text-emerald-400">
            Session Sécurisée
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Authentification Forteresse avec rotation de jetons
          </p>
        </div>

        {/* Carte 3 : Niveau d'Abonnement (Pro) ou Vigilance (Particulier) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border shadow-soft sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {isPro ? 'Formule Actuelle' : 'Garantie Foncier'}
            </span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-slate-900 dark:text-white capitalize">
            {isPro ? (proProfile?.subscriptionPlan || 'Formule Découverte') : 'Contrôle ACD Strict'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isPro ? 'Visibilité active sur la Côte d’Ivoire' : 'Protection anti-litiges & multi-ventes'}
          </p>
        </div>
      </div>

      {/* Raccourcis d'actions prioritaires */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Actions Rapides & Services Foncier / BTP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.link}
                className="group p-5 rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border hover:border-brand-primary/50 dark:hover:border-brand-primary/50 shadow-soft hover:shadow-md transition-all flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-sky-300 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recommandation de Sécurité Nationale */}
      <div className="p-4 sm:p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 dark:bg-brand-primary/10 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-brand-primary dark:text-sky-300 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p className="font-bold text-slate-900 dark:text-white">
            Rappel de Sécurité Foncière GayaBTP
          </p>
          <p className="leading-relaxed">
            N’effectuez aucun versement d’argent direct sans vérification du titre foncier officiel (Arrêté de Concession Définitive — ACD) auprès de la Conservation Foncière et sans acte notarié authentique.
          </p>
        </div>
      </div>
    </div>
  );
};
