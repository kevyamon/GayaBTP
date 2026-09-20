import React from 'react';
import { Link } from 'react-router-dom';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-950 font-sans">
      {/* 1. Arrière-plan Architectural Plein Écran (Pont de Cocody / Abidjan) */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none scale-105 transform transition-transform duration-1000"
        style={{
          backgroundImage: 'url(/authbg.png)',
        }}
        aria-hidden="true"
      />

      {/* 2. Dégradé de Transition Vertical */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none bg-gradient-to-b from-slate-950/25 via-slate-950/50 to-slate-950/85"
        aria-hidden="true"
      />

      {/* Orbe lumineux subtil derrière le panneau de verre */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-primary/15 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 3. En-tête Mobile & Ordinateur avec Logo Officiel GayaBTP */}
      <header className="relative z-10 pt-5 pb-3 px-4 flex flex-col items-center justify-center text-center shrink-0 md:pt-8 md:pb-4">
        <Link
          to="/"
          className="group inline-flex flex-col items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 duration-200"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/50 shadow-xl flex items-center justify-center bg-white/90 backdrop-blur-md">
            <img
              src="/logo.png"
              alt="Logo Officiel GayaBTP"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="font-title text-2xl sm:text-3xl tracking-wide text-white drop-shadow-md">
            Gaya<span className="text-brand-primary">BTP</span>
          </span>
        </Link>
        <p className="hidden sm:block text-[11px] sm:text-xs text-white/80 font-medium tracking-wide mt-0.5 drop-shadow">
          Plateforme Nationale du Foncier &amp; du BTP en Côte d’Ivoire
        </p>
      </header>

      {/* 4. Panneau Formulaire Conditionnel (Desktop centré vs Mobile Bottom-Sheet Fixe) */}
      
      {/* --- A. Affichage Ordinateur (md et au-dessus) : Carte centrée spacieuse --- */}
      <main className="hidden md:flex relative z-10 flex-1 items-center justify-center px-4 sm:px-6 py-4">
        <div className="w-full max-w-md lg:max-w-lg animate-in fade-in zoom-in-95 duration-300 my-auto">
          <GlassmorphismCard
            intensity="strong"
            className="p-7 lg:p-8 space-y-5 shadow-2xl rounded-3xl border border-white/40 dark:border-white/15 bg-white/80 dark:bg-slate-900/85 backdrop-blur-2xl"
          >
            {/* Titre & Sous-titre */}
            <div className="space-y-1 text-left">
              <h1 className="text-2xl lg:text-3xl font-title text-slate-900 dark:text-white">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Formulaire complet */}
            <div className="pt-1">{children}</div>

            {/* Copyright automatique à l'intérieur du panneau de verre */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                &copy; {currentYear} GayaBTP. Tous droits réservés.
              </p>
            </div>
          </GlassmorphismCard>
        </div>
      </main>

      {/* --- B. Affichage Mobile (< md) : Panneau Fixe en bas (Bottom Sheet) avec défilement interne fluide --- */}
      <main className="md:hidden fixed inset-x-0 bottom-0 top-[24vh] z-20 flex flex-col rounded-t-[32px] bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-x border-white/60 dark:border-white/15 shadow-[0_-12px_45px_rgba(0,0,0,0.4)] overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        {/* Poignée tactile indicative */}
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300/90 dark:bg-slate-600" />
        </div>

        {/* En-tête fixe du formulaire mobile */}
        <div className="px-5 pt-1 pb-2 shrink-0 border-b border-slate-200/40 dark:border-white/5">
          <h1 className="text-xl font-title text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
            {subtitle}
          </p>
        </div>

        {/* Contenu défilable de manière indépendante à l'intérieur de la feuille */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3 space-y-4 no-scrollbar">
          {children}

          {/* Copyright automatique à l'intérieur du flux mobile sans espace résiduel */}
          <div className="pt-3 pb-2 text-center border-t border-slate-200/50 dark:border-white/10">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              &copy; {currentYear} GayaBTP. Tous droits réservés.
            </p>
          </div>
        </div>
      </main>

      {/* Spacer pour l'écran desktop */}
      <div className="hidden md:block h-2" />
    </div>
  );
};
