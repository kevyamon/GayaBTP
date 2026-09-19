import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { PropertyType, LandTitleType } from '../../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../../theme/theme';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { ListingFiltersModal } from './ListingFiltersModal';

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

  // Calcul du nombre de filtres actifs
  const activeFiltersCount = [
    Boolean(filters.city),
    Boolean(filters.district),
    Boolean(filters.propertyType),
    Boolean(filters.titleType),
    Boolean(filters.maxPrice),
    filters.sort !== 'recent',
  ].filter(Boolean).length;

  const hasActiveFilters = Boolean(filters.search) || activeFiltersCount > 0;

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
    IVORY_COAST_LOCATIONS.find((l) => l.city === filters.city)?.districts || [];

  return (
    <div className="space-y-3">
      {/* 1. VERSION MOBILE (< md) : Barre de recherche + Bouton Filtrer dépliant la modale */}
      <div className="block md:hidden space-y-2.5">
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

          {hasActiveFilters && (
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

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-1">
          {totalResults} annonce{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
        </div>
      </div>

      {/* 2. MODALE MOBILE */}
      <ListingFiltersModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        tempFilters={tempFilters}
        setTempFilters={setTempFilters}
        onApply={handleApplyMobileFilters}
        onReset={handleResetMobileFilters}
      />

      {/* 3. VERSION DESKTOP (md:block) : Panneau Glassmorphism complet aligné sur l'Annuaire */}
      <GlassmorphismCard intensity="medium" className="hidden md:block p-5 space-y-4">
        {/* Barre de recherche principale */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par commune, titre foncier, type de bien, mot-clé..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-11 pr-4 py-2.5 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-smooth"
          />
        </div>

        {/* Grille des sélecteurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Ville */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ville / Région
            </label>
            <select
              value={filters.city}
              onChange={(e) => onChange({ ...filters, city: e.target.value, district: '' })}
              className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Commune / Secteur
            </label>
            <select
              value={filters.district}
              onChange={(e) => onChange({ ...filters, district: e.target.value })}
              disabled={activeDistricts.length === 0}
              className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
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
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Titre Foncier
            </label>
            <select
              value={filters.titleType}
              onChange={(e) => onChange({ ...filters, titleType: e.target.value as LandTitleType | '' })}
              className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Tous les titres</option>
              {LAND_TITLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.value.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Type de bien */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Type de bien
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => onChange({ ...filters, propertyType: e.target.value as PropertyType | '' })}
              className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Tous les types</option>
              <option value="terrain">Terrain / Parcelle</option>
              <option value="maison">Maison / Villa</option>
              <option value="appartement">Appartement</option>
              <option value="commercial">Local Commercial</option>
            </select>
          </div>

          {/* Ordre d'affichage */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ordre d’affichage
            </label>
            <select
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value as typeof filters.sort })}
              className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="recent">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="surface_desc">Plus grande surface</option>
            </select>
          </div>
        </div>

        {/* Pied du panneau : Compteur & Réinitialisation */}
        <div className="pt-2 border-t border-brand-light-border dark:border-brand-dark-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">
            {totalResults} offre{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-brand-urgent hover:underline font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser les filtres</span>
            </button>
          )}
        </div>
      </GlassmorphismCard>
    </div>
  );
};
