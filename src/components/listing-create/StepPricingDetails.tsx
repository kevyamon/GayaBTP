import React from 'react';
import { FileText, ArrowLeft, ArrowRight, Zap, Droplets, Shield, Check } from 'lucide-react';
import { PropertyType } from '../../types';
import { Button } from '../ui/Button';

export interface PricingDetailsData {
  title: string;
  surfaceM2: number;
  priceFCFA: number;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  hasWater: boolean;
  hasElectricity: boolean;
  hasRoadAccess: boolean;
  isFenced: boolean;
}

interface StepProps {
  propertyType: PropertyType;
  data: PricingDetailsData;
  onChange: (data: PricingDetailsData) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepPricingDetails: React.FC<StepProps> = ({
  propertyType,
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const isBuilt = propertyType === 'maison' || propertyType === 'appartement' || propertyType === 'commercial';

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    onChange({ ...data, priceFCFA: rawVal ? parseInt(rawVal, 10) : 0 });
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    onChange({ ...data, surfaceM2: rawVal ? parseInt(rawVal, 10) : 0 });
  };

  const pricePerM2 =
    data.priceFCFA > 0 && data.surfaceM2 > 0
      ? Math.round(data.priceFCFA / data.surfaceM2)
      : null;

  const isComplete =
    data.title.trim().length >= 5 &&
    data.surfaceM2 > 0 &&
    data.priceFCFA > 0 &&
    data.description.trim().length >= 15;

  return (
    <div className="space-y-6">
      {/* 1. Titre de l'annonce */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Titre de votre annonce *
        </label>
        <input
          type="text"
          required
          placeholder="Ex : Superbe parcelle viabilisée de 500 m² avec ACD à Bingerville"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
        />
      </div>

      {/* 2. Superficie & Prix FCFA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Superficie totale (m²) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Ex : 500"
              value={data.surfaceM2 > 0 ? data.surfaceM2.toString() : ''}
              onChange={handleSurfaceChange}
              className="w-full px-3.5 py-2.5 pr-12 text-xs sm:text-sm font-bold rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              m²
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Prix de vente ou loyer (FCFA) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Ex : 25 000 000"
              value={data.priceFCFA > 0 ? data.priceFCFA.toLocaleString('fr-FR') : ''}
              onChange={handlePriceChange}
              className="w-full px-3.5 py-2.5 pr-16 text-xs sm:text-sm font-bold rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-primary">
              FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Résumé du ratio Prix / m² */}
      {pricePerM2 && (
        <div className="p-3 rounded-brand bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <span>Ratio au mètre carré :</span>
          <strong className="text-brand-primary font-bold">{pricePerM2.toLocaleString('fr-FR')} FCFA / m²</strong>
        </div>
      )}

      {/* 3. Nombre de pièces si bien bâti */}
      {isBuilt && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Nombre de chambres
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ex : 4"
              value={data.bedrooms || ''}
              onChange={(e) => onChange({ ...data, bedrooms: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Salles d’eau / WC
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ex : 3"
              value={data.bathrooms || ''}
              onChange={(e) => onChange({ ...data, bathrooms: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 4. Commodités et Viabilisation */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Viabilisation &amp; Atouts disponibles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { key: 'hasWater', label: 'Eau SODECI', icon: Droplets },
            { key: 'hasElectricity', label: 'Courant CIE', icon: Zap },
            { key: 'hasRoadAccess', label: 'Accès bitumé', icon: FileText },
            { key: 'isFenced', label: 'Clôturé', icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const checked = (data as any)[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange({ ...data, [item.key]: !checked })}
                className={`p-2.5 rounded-brand border text-xs font-semibold flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                  checked
                    ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                    : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {checked && <Check className="w-3.5 h-3.5 text-brand-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Description détaillée */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Description complète du bien *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Décrivez précisément les points forts : topographie (terrain plat ou surélevé), proximité des grands axes, viabilisation, voisinage, potentiel d’investissement..."
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm resize-none"
        />
      </div>

      {/* Boutons de navigation */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onPrev}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0 text-xs sm:text-sm px-3 sm:px-4"
        >
          Retour
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!isComplete}
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="text-xs sm:text-sm px-3.5 sm:px-5"
        >
          <span className="hidden sm:inline">Étape suivante : </span>
          <span>Photos &amp; Contact</span>
        </Button>
      </div>
    </div>
  );
};
