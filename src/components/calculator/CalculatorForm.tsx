import React from 'react';
import { CreditCard } from 'lucide-react';
import { LAND_TITLE_TYPES } from '../../theme/theme';
import { CalculatorInput } from '../../services/calculator.service';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';

const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  {
    value: 'terrain',
    label: 'Terrain nu / Parcelle',
    description: 'Terrain à bâtir, lotissement ou parcelle viabilisée',
  },
  {
    value: 'maison',
    label: 'Villa / Maison individuelle',
    description: 'Maison basse, villa duplex ou résidence individuelle',
  },
  {
    value: 'appartement',
    label: 'Appartement en copropriété',
    description: 'Logement privatif au sein d’un immeuble résidentiel',
  },
  {
    value: 'commercial',
    label: 'Bâtiment / Local commercial',
    description: 'Bureau, entrepôt, boutique ou complexe professionnel',
  },
];

const TITLE_TYPE_OPTIONS: SelectOption[] = LAND_TITLE_TYPES.map((t) => ({
  value: t.value,
  label: t.label,
  description: t.description,
  badge: t.value.toUpperCase(),
}));

interface CalculatorFormProps {
  values: CalculatorInput;
  onChange: (newValues: CalculatorInput) => void;
}

const PRESET_PRICES = [15000000, 25000000, 50000000, 85000000, 120000000];

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ values, onChange }) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    onChange({ ...values, purchasePriceFCFA: num });
  };

  const handlePresetSelect = (preset: number) => {
    onChange({ ...values, purchasePriceFCFA: preset });
  };

  return (
    <div className="space-y-6">
      {/* 1. Saisie du prix d'acquisition */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Prix d’achat du bien ou de la parcelle (FCFA) *
        </label>
        <div className="relative">
          <input
            type="text"
            value={values.purchasePriceFCFA > 0 ? values.purchasePriceFCFA.toLocaleString('fr-FR') : ''}
            onChange={handlePriceChange}
            placeholder="Ex : 25 000 000"
            className="w-full pl-4 pr-16 py-3.5 text-lg font-bold rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-slate-400 select-none">
            FCFA
          </span>
        </div>

        {/* Boutons rapides de montants usuels */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_PRICES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                values.purchasePriceFCFA === preset
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-brand-primary/50'
              }`}
            >
              {(preset / 1000000).toLocaleString('fr-FR')}&nbsp;M
            </button>
          ))}
        </div>
      </div>

      {/* 2. Type de bien et Titre juridique */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelect
          label="Type de bien immobilier"
          value={values.propertyType}
          onChange={(val) => onChange({ ...values, propertyType: val })}
          options={PROPERTY_TYPE_OPTIONS}
          modalTitle="Type de bien immobilier"
          modalSubtitle="Sélectionnez la typologie de votre bien foncier ou bâti"
        />

        <CustomSelect
          label="Statut du titre foncier"
          value={values.titleType}
          onChange={(val) => onChange({ ...values, titleType: val })}
          options={TITLE_TYPE_OPTIONS}
          modalTitle="Statut du titre foncier"
          modalSubtitle="Sélectionnez le document ou certificat de propriété légale"
        />
      </div>

      {/* 3. Option Financement bancaire / Hypothèque */}
      <div className="p-3.5 rounded-brand bg-slate-50 dark:bg-slate-900/50 border border-brand-light-border dark:border-brand-dark-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CreditCard className="w-4 h-4 text-brand-secondary shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
              Recours à un crédit bancaire avec hypothèque
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Ajoute l’acte d’affectation hypothécaire (~1.2% + formalités).
            </div>
          </div>
        </div>
        <input
          type="checkbox"
          id="mortgage-toggle"
          checked={values.hasMortgage}
          onChange={(e) => onChange({ ...values, hasMortgage: e.target.checked })}
          className="w-4 h-4 text-brand-primary rounded border-slate-300 focus:ring-brand-primary cursor-pointer shrink-0"
        />
      </div>
    </div>
  );
};
