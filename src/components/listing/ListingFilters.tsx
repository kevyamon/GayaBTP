import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { PropertyType, LandTitleType } from '../../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../../theme/theme';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

export interface ListingFilterValues {
  city: string;
  district: string;
  propertyType: PropertyType | '';
  titleType: LandTitleType | '';
  maxPrice: string;
  sort: 'recent' | 'price_asc' | 'price_desc' | 'surface_desc';
  search: string;
}

interface ListingFiltersProps {
  filters: ListingFilterValues;
  onChange: (newFilters: ListingFilterValues) => void;
  onReset: () => void;
  totalResults: number;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<ListingFilterValues>(filters);

  // Synchronisation des filtres temporaires à l'ouverture de la modale mobile
  useEffect(() => {
    if (isMobileModalOpen) {
      setTempFilters(filters);
    }
  }, [isMobileModalOpen, filters]);

  // Calcul du nombre de filtres actifs (hors tri et texte)
  const activeFiltersCount = [
    Boolean(filters.city),
    Boolean(filters.district),
    Boolean(filters.propertyType),
    Boolean(filters.titleType),
    Boolean(filters.maxPrice),
    filters.sort !== 'recent',
  ].filter(Boolean).length;

  const handleApplyMobileFilters = () => {
    onChange(tempFilters);
    setIsMobileModalOpen(false);
  };

  const handleResetMobileFilters = () => {
    const emptyFilters: ListingFilterValues = {
      city: '',
      district: '',
      propertyType: '',
      titleType: '',
      maxPrice: '',
      sort: 'recent',
      search: filters.search,
    };
    setTempFilters(emptyFilters);
    onChange(emptyFilters);
    setIsMobileModalOpen(false);
  };

  const activeDistricts =
    IVORY_COAST_LOCATIONS.find((l) => l.city === (isMobileModalOpen ? tempFilters.city : filters.city))
      ?.districts || [];

  return (
    <div className="space-y-3">
      {/* 1. VERSION MOBILE (< lg) : Barre de recherche + Bouton Filtrer dépliant la modale */}
      <div className="block lg:hidden space-y-2.5">
        {/* Barre de recherche mobile */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une commune, un titre, un mot-clé..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
          />
        </div>

        {/* Bouton Filtrer sous la barre de recherche avec badge & actions rapides */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsMobileModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-brand font-bold text-xs bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border text-slate-800 dark:text-slate-100 hover:border-brand-primary shadow-sm active:scale-[0.98] transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-primary shrink-0" />
            <span>Filtrer les annonces</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-primary text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 py-2.5 px-3 rounded-brand text-xs font-bold text-brand-urgent hover:bg-brand-urgent/10 transition-colors border border-brand-urgent/30"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Effacer</span>
            </button>
          )}
        </div>

        {/* Compteur de résultats sur mobile */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-1">
          {totalResults} annonce{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
        </div>
      </div>

      {/* 2. MODALE POP-UP MOBILE DE FILTRES */}
      <Modal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        title="Filtres de recherche"
        subtitle="Affinez vos critères pour trouver la parcelle ou le bien idéal"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          {/* Ville */}
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

          {/* Commune */}
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

          {/* Tri */}
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

          {/* Actions de validation dans la modale */}
          <div className="pt-4 border-t border-brand-light-border dark:border-brand-dark-border flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetMobileFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Réinitialiser
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApplyMobileFilters}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. VERSION DESKTOP (lg:block) : Barre complète en ligne */}
      <GlassmorphismCard
        intensity="medium"
        className="hidden lg:grid p-4 rounded-brand-lg border border-brand-light-border dark:border-brand-dark-border shadow-sm grid-cols-6 gap-3 items-end"
      >
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ville</label>
          <select
            value={filters.city}
            onChange={(e) => onChange({ ...filters, city: e.target.value, district: '' })}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">Toutes les villes</option>
            {IVORY_COAST_LOCATIONS.map((l) => (
              <option key={l.city} value={l.city}>
                {l.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Commune</label>
          <select
            value={filters.district}
            onChange={(e) => onChange({ ...filters, district: e.target.value })}
            disabled={activeDistricts.length === 0}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium disabled:opacity-50"
          >
            <option value="">Toutes les communes</option>
            {activeDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Titre Foncier</label>
          <select
            value={filters.titleType}
            onChange={(e) => onChange({ ...filters, titleType: e.target.value as LandTitleType | '' })}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">Tous les titres</option>
            {LAND_TITLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.value.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Type de bien</label>
          <select
            value={filters.propertyType}
            onChange={(e) => onChange({ ...filters, propertyType: e.target.value as PropertyType | '' })}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">Tous les types</option>
            <option value="terrain">Terrain</option>
            <option value="maison">Maison / Villa</option>
            <option value="appartement">Appartement</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tri par</label>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as typeof filters.sort })}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="surface_desc">Plus grande surface</option>
          </select>
        </div>

        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full text-xs"
          >
            Réinitialiser
          </Button>
        </div>
      </GlassmorphismCard>
    </div>
  );
};
