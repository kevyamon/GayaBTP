import React, { useState } from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { GlassmorphismCard, GlassIntensity } from '../components/ui/GlassmorphismCard';
import { Button } from '../components/ui/Button';

export const GlassmorphismDemoPage: React.FC = () => {
  const [activeIntensity, setActiveIntensity] = useState<GlassIntensity>('medium');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 space-y-12">
      
      {/* 1. EN-TÊTE DU BANC D'ESSAI */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary-light dark:bg-brand-primary/20 text-brand-primary text-xs font-bold">
          <Layers className="w-4 h-4" />
          <span>GayaBTP Glassmorphism Design System — Banc d’Essai</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-title text-slate-900 dark:text-white leading-tight">
          Surfaces de Verre Dépoli Haute Fidélité
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Vérification de la translucidité, du flou de réfraction (28px), de la saturation (185%), des reflets internes et de la séparation de profondeur sur 5 types d’arrières-plans.
        </p>

        {/* Sélecteur d'intensité global */}
        <div className="pt-2 flex justify-center gap-2">
          {(['subtle', 'medium', 'strong'] as GlassIntensity[]).map((int) => (
            <button
              key={int}
              type="button"
              onClick={() => setActiveIntensity(int)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeIntensity === int
                  ? 'bg-brand-primary text-white shadow-md scale-105'
                  : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-brand-light-border dark:border-brand-dark-border hover:bg-white'
              }`}
            >
              Intensité : {int.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* TEST B : REPRODUCTION EXACTE DE L'IMAGE DE RÉFÉRENCE (Cercles & Formes colorées) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            TEST B — Référence Visuelle Officielle (Cercles colorés vifs & Matière vitreuse)
          </h2>
          <span className="text-xs font-bold text-brand-primary uppercase">Référence Maître</span>
        </div>

        <div className="relative min-h-[440px] rounded-brand-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-6 sm:p-10">
          {/* Formes géométriques colorées traversant l'arrière-plan */}
          <div className="absolute top-4 left-6 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 shadow-lg" />
          <div className="absolute top-8 right-12 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-400 opacity-90" />
          <div className="absolute top-6 right-36 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600" />
          <div className="absolute top-8 right-6 w-12 h-12 rounded-full border-4 border-indigo-700" />
          <div className="absolute bottom-6 left-8 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-500" />
          <div className="absolute bottom-4 left-0 w-28 h-28 rounded-full border-8 border-orange-500" />
          <div className="absolute bottom-4 right-10 w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-purple-700 to-fuchsia-600" />
          <div className="absolute bottom-12 right-72 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-400" />

          {/* Carte GlassmorphismCard flottante au-dessus des formes */}
          <GlassmorphismCard
            intensity={activeIntensity}
            interactive
            className="w-full max-w-xl p-8 sm:p-10 space-y-6 shadow-2xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-brand-primary">
                  GayaBTP Glass Surface
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/60 text-slate-800 text-[11px] font-bold backdrop-blur-sm border border-white/60">
                  {activeIntensity.toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-title text-slate-900 tracking-wide">
                GLASSMORPHISM
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Observez la réfraction douce des orbes rouge, orange et pourpre à travers cette plaque de verre. Les contours restent nets et lumineux tandis que les couleurs diffusent à l’intérieur.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Tester l’action
              </Button>
              <Button variant="outline" size="sm">
                Bouton Verre
              </Button>
            </div>
          </GlassmorphismCard>
        </div>
      </section>

      {/* GRILLE DES TESTS A, C, D, E */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TEST A : Gradient Vif */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            TEST A — Gradient Coloré Vif
          </h3>
          <div className="relative min-h-[300px] rounded-brand-xl bg-gradient-to-br from-brand-primary via-rose-500 to-brand-secondary p-6 sm:p-8 flex items-center justify-center overflow-hidden">
            <GlassmorphismCard intensity={activeIntensity} className="w-full p-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900">Carte sur Gradient</h4>
              <p className="text-xs text-slate-800 font-medium">
                Les teintes chaudes et froides du gradient traversent la surface avec une diffusion équilibrée.
              </p>
              <Button variant="secondary" size="sm">Explorer</Button>
            </GlassmorphismCard>
          </div>
        </div>

        {/* TEST C : Background Photographique BTP */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            TEST C — Arrière-plan Photographique Chantier
          </h3>
          <div className="relative min-h-[300px] rounded-brand-xl overflow-hidden p-6 sm:p-8 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=800&q=80"
              alt="Chantier BTP"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <GlassmorphismCard intensity={activeIntensity} className="w-full p-6 space-y-4 relative z-10">
              <h4 className="text-base font-bold text-slate-900">Expertise Chantier BTP</h4>
              <p className="text-xs text-slate-800 font-medium">
                La photographie de construction reste reconnaissable sous le verre tout en assurant une parfaite lisibilité des textes.
              </p>
              <Button variant="primary" size="sm">Contacter l’ingénieur</Button>
            </GlassmorphismCard>
          </div>
        </div>

        {/* TEST D : Background Sombre (Dark Mode) */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            TEST D — Arrière-plan Sombre / Dark Mode
          </h3>
          <div className="relative min-h-[300px] rounded-brand-xl bg-slate-950 p-6 sm:p-8 flex items-center justify-center overflow-hidden border border-slate-800">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-primary/30 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-sky-500/30 blur-2xl" />
            
            <GlassmorphismCard intensity={activeIntensity} className="w-full p-6 space-y-4">
              <h4 className="text-base font-bold text-white">Surface Verre Sombre</h4>
              <p className="text-xs text-slate-300 font-medium">
                En mode nuit, le verre préserve une translucidité profonde sans saturer excessivement la composition.
              </p>
              <Button variant="primary" size="sm">Valider la transaction</Button>
            </GlassmorphismCard>
          </div>
        </div>

        {/* TEST E : Background Clair Épuré */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            TEST E — Arrière-plan Clair Standard
          </h3>
          <div className="relative min-h-[300px] rounded-brand-xl bg-slate-100 p-6 sm:p-8 flex items-center justify-center overflow-hidden border border-slate-200">
            <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-brand-accent/30 blur-xl" />
            <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-brand-primary/20 blur-xl" />

            <GlassmorphismCard intensity={activeIntensity} className="w-full p-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900">Surface Verre Clair</h4>
              <p className="text-xs text-slate-700 font-medium">
                Sur un fond clair de page, la bordure lumineuse et la lueur interne détachent nettement la carte.
              </p>
              <Button variant="secondary" size="sm">Consulter le dossier</Button>
            </GlassmorphismCard>
          </div>
        </div>

      </div>

    </div>
  );
};
