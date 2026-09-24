import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { CostBreakdownCard } from '../components/calculator/CostBreakdownCard';
import { LegalAdviceCard } from '../components/calculator/LegalAdviceCard';
import { GlassmorphismCard } from '../components/ui/GlassmorphismCard';
import {
  CalculatorInput,
  calculateAcquisitionCosts,
} from '../services/calculator.service';

export const CalculatorPage: React.FC = () => {
  const [formValues, setFormValues] = useState<CalculatorInput>({
    purchasePriceFCFA: 25000000,
    propertyType: 'terrain',
    titleType: 'ACD',
    hasMortgage: false,
  });

  const calculationResult = useMemo(() => {
    return calculateAcquisitionCosts(formValues);
  }, [formValues]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-36 sm:pb-40 lg:pb-16 space-y-8 overflow-hidden">
      {/* Orbes ambiants diffus pour la réfraction du verre dépoli */}
      <div className="absolute top-16 left-12 w-96 h-96 rounded-full bg-brand-accent/20 dark:bg-brand-accent/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-12 w-96 h-96 rounded-full bg-brand-primary/15 dark:bg-brand-primary/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-sky-400/15 dark:bg-sky-400/10 blur-3xl pointer-events-none -z-10" />

      {/* 1. En-tête principal épuré */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title text-slate-900 dark:text-white leading-tight">
          Simulateur des Frais d’Acquisition Foncière
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Anticipez l’ensemble des dépenses légales (droits d’enregistrement DGI à 6 %, honoraires notariés dégressifs, conservation foncière et débours) pour un achat 100 % sécurisé.
        </p>
      </div>

      {/* 2. Grille principale : Formulaire de calcul + Récapitulatif détaillé */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start">
        {/* Colonne Gauche : Formulaire de saisie dynamique (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassmorphismCard intensity="medium" className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/40 dark:border-white/10">
              <div className="p-2 rounded-brand bg-brand-primary/15 text-brand-primary">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Paramètres de votre projet
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Modifiez le montant pour recalculer en temps réel.
                </p>
              </div>
            </div>

            <CalculatorForm values={formValues} onChange={setFormValues} />
          </GlassmorphismCard>
        </div>

        {/* Colonne Droite : Décomposition des frais & Conseils juridiques (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CostBreakdownCard result={calculationResult} />
          <LegalAdviceCard />
        </div>
      </div>
    </div>
  );
};
