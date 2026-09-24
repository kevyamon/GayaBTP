import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { CalculatorResult } from '../../services/calculator.service';

import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { formatFCFA } from '../../theme/theme';
import { useToast } from '../../contexts/ToastContext';

interface CostBreakdownCardProps {
  result: CalculatorResult;
}

export const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({ result }) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `
SIMULATION DES FRAIS D’ACQUISITION FONCIÈRE — GAYABTP
------------------------------------------------------
Prix d’achat du bien : ${formatFCFA(result.purchasePriceFCFA)}
1. Droits d’enregistrement DGI (État) : ${formatFCFA(result.dgiRegistrationFees.amountFCFA)} (${result.dgiRegistrationFees.percentage}%)
2. Émoluments réglementés du Notaire : ${formatFCFA(result.notaryFees.amountFCFA)}
3. TVA légale sur honoraires (18%) : ${formatFCFA(result.notaryVat.amountFCFA)}
4. Conservation Foncière & Débours : ${formatFCFA(result.administrativeFormalities.amountFCFA)}
${result.mortgageFees ? `5. Frais d’hypothèque bancaire : ${formatFCFA(result.mortgageFees.amountFCFA)}\n` : ''}------------------------------------------------------
TOTAL DES FRAIS D’ACTE : ${formatFCFA(result.totalFeesFCFA)} (~${result.feesPercentageOnPrice}% du prix)
BUDGET TOTAL D’ACQUISITION : ${formatFCFA(result.totalBudgetFCFA)}
------------------------------------------------------
GayaBTP — https://gayabtp.ci
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    success('Récapitulatif copié !', 'Vous pouvez le coller dans votre e-mail ou l’envoyer à votre notaire.');
    setTimeout(() => setCopied(false), 3000);
  };

  const dgiPercent = result.totalFeesFCFA > 0 ? (result.dgiRegistrationFees.amountFCFA / result.totalFeesFCFA) * 100 : 0;
  const notaryPercent = result.totalFeesFCFA > 0 ? ((result.notaryFees.amountFCFA + result.notaryVat.amountFCFA) / result.totalFeesFCFA) * 100 : 0;
  const adminPercent = 100 - dgiPercent - notaryPercent;

  return (
    <GlassmorphismCard intensity="medium" className="p-5 sm:p-6 space-y-6 !border-2 !border-brand-primary">
      {/* 1. En-tête : Grand total Budget Clé en Main */}
      <div className="space-y-3 pb-5 border-b border-white/40 dark:border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Budget Global Prévisionnel
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
            Frais estimés : ~{result.feesPercentageOnPrice}%
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white tracking-wide">
            {formatFCFA(result.totalBudgetFCFA)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            dont <strong className="text-brand-urgent font-bold">{formatFCFA(result.totalFeesFCFA)}</strong> de frais d’acte
          </div>
        </div>

        {/* Barre de répartition proportionnelle des frais */}
        <div className="space-y-1.5 pt-2">
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
            <div
              style={{ width: `${dgiPercent}%` }}
              className="bg-brand-secondary h-full transition-all duration-500"
              title={`Part DGI : ${dgiPercent.toFixed(1)}%`}
            />
            <div
              style={{ width: `${notaryPercent}%` }}
              className="bg-brand-primary h-full transition-all duration-500"
              title={`Part Notaire : ${notaryPercent.toFixed(1)}%`}
            />
            <div
              style={{ width: `${adminPercent}%` }}
              className="bg-brand-accent h-full transition-all duration-500"
              title={`Formalités : ${adminPercent.toFixed(1)}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex-wrap gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-secondary inline-block" />
              Impôts DGI (~{dgiPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" />
              Notaire (~{notaryPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
              Conservation &amp; Débours
            </span>
          </div>
        </div>
      </div>

      {/* 2. Détail ligne par ligne des postes de frais */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Décomposition des frais notariés &amp; fiscaux
        </h4>

        <div className="space-y-2 text-xs">
          {/* Ligne 1 : DGI */}
          <div className="p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{result.dgiRegistrationFees.label}</span>
              <span className="text-brand-secondary dark:text-sky-300">
                {formatFCFA(result.dgiRegistrationFees.amountFCFA)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {result.dgiRegistrationFees.description}
            </p>
          </div>

          {/* Ligne 2 : Émoluments Notaire */}
          <div className="p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{result.notaryFees.label}</span>
              <span className="text-brand-primary">{formatFCFA(result.notaryFees.amountFCFA)}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {result.notaryFees.description}
            </p>
          </div>

          {/* Ligne 3 : TVA sur honoraires */}
          <div className="p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{result.notaryVat.label}</span>
              <span>{formatFCFA(result.notaryVat.amountFCFA)}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {result.notaryVat.description}
            </p>
          </div>

          {/* Ligne 4 : Formalités & Débours */}
          <div className="p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 space-y-1 backdrop-blur-sm">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{result.administrativeFormalities.label}</span>
              <span>{formatFCFA(result.administrativeFormalities.amountFCFA)}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {result.administrativeFormalities.description}
            </p>
          </div>

          {/* Ligne 5 : Hypothèque si active */}
          {result.mortgageFees && (
            <div className="p-3 rounded-brand bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1 backdrop-blur-sm">
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span>{result.mortgageFees.label}</span>
                <span className="text-amber-700 dark:text-amber-400">{formatFCFA(result.mortgageFees.amountFCFA)}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {result.mortgageFees.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bouton Copier / Partager le récapitulatif */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleCopySummary}
          className="w-full py-2.5 px-4 rounded-brand font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Récapitulatif copié dans le presse-papier' : 'Copier l’estimation détaillée'}</span>
        </button>
      </div>
    </GlassmorphismCard>
  );
};
