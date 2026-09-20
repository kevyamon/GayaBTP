import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
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

      {/* 2. Dégradé de Transition Vertical (Image nette en haut -> Blur et fondu fluide en bas) */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none bg-gradient-to-b from-slate-950/30 via-slate-950/60 to-slate-950/90"
        aria-hidden="true"
      />

      {/* Orbe lumineux subtil derrière le panneau de verre */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-primary/20 blur-[120px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* 3. En-tête avec Logo Officiel GayaBTP */}
      <header className="relative z-10 pt-8 pb-4 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <Link
          to="/"
          className="group inline-flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95 duration-200"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-white/40 shadow-xl flex items-center justify-center bg-white/90 backdrop-blur-md">
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
        <p className="text-[11px] sm:text-xs text-white/80 font-medium tracking-wide mt-1 drop-shadow">
          Plateforme Nationale du Foncier &amp; du BTP en Côte d’Ivoire
        </p>
      </header>

      {/* 4. Panneau Central Glassmorphism Translucide */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-4">
        <div className="w-full max-w-md sm:max-w-lg animate-in fade-in zoom-in-95 duration-300">
          <GlassmorphismCard
            intensity="strong"
            className="p-6 sm:p-8 space-y-6 shadow-2xl rounded-3xl border border-white/40 dark:border-white/15 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl"
          >
            {/* Titre & Sous-titre du formulaire */}
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Contenu dynamique (Connexion, Inscription ou Réinitialisation) */}
            <div className="pt-1">{children}</div>
          </GlassmorphismCard>
        </div>
      </main>

      {/* 5. Pied de Page — Indicateurs de Sécurité & Confiance */}
      <footer className="relative z-10 py-6 px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-6 text-[11px] sm:text-xs text-white/80 font-semibold drop-shadow">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-brand-primary stroke-[2.5px]" />
            Sécurisé
          </span>
          <span className="text-white/40">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 stroke-[2.5px]" />
            Rapide
          </span>
          <span className="text-white/40">•</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5px]" />
            Fiable
          </span>
        </div>
        <p className="text-[10px] text-white/60">
          &copy; {new Date().getFullYear()} GayaBTP. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
};
