import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { PropertyType, LandTitleType } from '../../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../../theme/theme';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ListingFilterValues } from './ListingFilters';

interface ListingFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilters: ListingFilterValues;
  setTempFilters: React.Dispatch<React.SetStateAction<ListingFilterValues>>;
  onApply: () => void;
  onReset: () => void;
}

export const ListingFiltersModal: React.FC<ListingFiltersModalProps> = ({
  isOpen,
  onClose,
  tempFilters,
  setTempFilters,
  onApply,
  onReset,
}) => {
  const activeDistricts =
    IVORY_COAST_LOCATIONS.find((l) => l.city === tempFilters.city)?.districts || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filtres de recherche"
      subtitle="Affinez vos critères pour trouver la parcelle ou le bien idéal"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Ville / Région */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Ville / Région</label>
          <select
            value={tempFilters.city}
            onChange={(e) =>
              setTempFilters({ ...tempFilters, city: e.target.value, district: '' })
            }
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Toutes les villes</option>
            {IVORY_COAST_LOCATIONS.map((l) => (
              <option key={l.city} value={l.city}>
                {l.city}
              </option>
            ))}
          </select>
        </div>

        {/* Commune / Secteur */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Commune / Secteur</label>
          <select
            value={tempFilters.district}
            onChange={(e) => setTempFilters({ ...tempFilters, district: e.target.value })}
            disabled={activeDistricts.length === 0}
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium disabled:opacity-50 focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Toutes les communes</option>
            {activeDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Titre Foncier */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Titre Foncier Requis</label>
          <select
            value={tempFilters.titleType}
            onChange={(e) =>
              setTempFilters({ ...tempFilters, titleType: e.target.value as LandTitleType | '' })
            }
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Tous les titres juridiques</option>
            {LAND_TITLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.value.toUpperCase()} — {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type de bien */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Type de bien</label>
          <select
            value={tempFilters.propertyType}
            onChange={(e) =>
              setTempFilters({ ...tempFilters, propertyType: e.target.value as PropertyType | '' })
            }
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Tous les types de biens</option>
            <option value="terrain">Terrain / Parcelle</option>
            <option value="maison">Maison / Villa</option>
            <option value="appartement">Appartement</option>
            <option value="commercial">Local Commercial</option>
          </select>
        </div>

        {/* Budget maximum */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Budget Maximum (FCFA)</label>
          <input
            type="number"
            placeholder="Ex : 50 000 000"
            value={tempFilters.maxPrice}
            onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Ordre d'affichage */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">Ordre d’affichage</label>
          <select
            value={tempFilters.sort}
            onChange={(e) =>
              setTempFilters({ ...tempFilters, sort: e.target.value as typeof tempFilters.sort })
            }
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
          >
            <option value="recent">Plus récents en premier</option>
            <option value="price_asc">Prix croissant (du - cher au + cher)</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="surface_desc">Plus grande surface</option>
          </select>
        </div>

        {/* Actions de validation */}
        <div className="pt-4 border-t border-brand-light-border dark:border-brand-dark-border flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Réinitialiser
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onApply}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </Modal>
  );
};
