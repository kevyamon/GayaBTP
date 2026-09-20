import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, CheckSquare, Square, Check } from 'lucide-react';
import { ProFilterParams } from '../../services/pro.service';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';

interface ProFiltersProps {
  filters: ProFilterParams;
  onChange: (filters: ProFilterParams) => void;
  onReset: () => void;
  totalResults: number;
}

const SPECIALTY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes les spécialités' },
  { value: 'Géomètre-Expert', label: 'Géomètres-Experts (OGECI)', description: 'Bornage contradictoire, plans de morcellement et délimitation' },
  { value: 'Architecte', label: 'Architectes (CNOA)', description: 'Conception de plans, permis de construire et suivi esthétique' },
  { value: 'Gros Œuvre', label: 'Gros Œuvre, Maçonnerie & VRD', description: 'Fondations, béton armé, élévation et voiries' },
  { value: 'Électricité', label: 'Électricité Bâtiment & Solaire', description: 'Installations basse tension, coffrets et énergie solaire' },
  { value: 'Plomberie', label: 'Plomberie & Fluides Sanitaires', description: 'Réseaux d’évacuation, adduction d’eau et sanitaires' },
  { value: 'Topographie', label: 'Topographie & Bornage Foncier', description: 'Relevés altimétriques, implantations et géodésie' },
  { value: 'Suivi de Chantier', label: 'Maîtrise d’Œuvre & Contrôle', description: 'Supervision technique, coordination et réception de travaux' },
];

const CITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes les villes & communes' },
  { value: 'Abidjan', label: 'Abidjan (Toutes communes)', description: 'Cocody, Marcory, Yopougon, Plateau, Bingerville...' },
  { value: 'Grand-Bassam', label: 'Grand-Bassam', description: 'Zone balnéaire et littoral sud' },
  { value: 'Yamoussoukro', label: 'Yamoussoukro', description: 'Capitale politique et région du Bélier' },
  { value: 'San-Pédro', label: 'San-Pédro', description: 'Pôle portuaire du Sud-Ouest' },
  { value: 'Bouaké', label: 'Bouaké', description: 'Région du Gbêkê et centre' },
  { value: 'Korhogo', label: 'Korhogo', description: 'Région des Savanes et nord' },
];

export const ProFilters: React.FC<ProFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<ProFilterParams>(filters);

  useEffect(() => {
    if (isMobileModalOpen) {
      setTempFilters(filters);
    }
  }, [isMobileModalOpen, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleAccountTypeChange = (type: 'all' | 'entreprise' | 'artisan') => {
    onChange({ ...filters, accountType: type === 'all' ? undefined : type });
  };

  const toggleVerifiedOnly = () => {
    onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  const activeFiltersCount = [
    Boolean(filters.specialty && filters.specialty !== 'all'),
    Boolean(filters.city && filters.city !== 'all'),
    Boolean(filters.accountType),
    Boolean(filters.verifiedOnly),
  ].filter(Boolean).length;

  const hasActiveFilters = Boolean(filters.search) || activeFiltersCount > 0;

  const handleApplyMobileFilters = () => {
    onChange(tempFilters);
    setIsMobileModalOpen(false);
  };

  const handleResetMobileFilters = () => {
    const emptyFilters: ProFilterParams = {
      search: filters.search,
    };
    setTempFilters(emptyFilters);
    onChange(emptyFilters);
    setIsMobileModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* 1. VERSION MOBILE (< md) : Barre de recherche + Bouton Filtrer dépliant la modale */}
      <div className="block md:hidden space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, spécialité, mot-clé..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsMobileModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-brand font-bold text-xs bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border text-slate-800 dark:text-slate-100 hover:border-brand-primary shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-primary shrink-0" />
            <span>Filtrer les professionnels</span>
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
              className="inline-flex items-center gap-1 py-2.5 px-3 rounded-brand text-xs font-bold text-brand-urgent hover:bg-brand-urgent/10 transition-colors border border-brand-urgent/30 cursor-pointer"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Effacer</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold px-1">
          {totalResults} professionnel{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
        </div>
      </div>

      {/* 2. MODALE POP-UP MOBILE DE FILTRES PRO */}
      <Modal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        title="Filtres professionnels"
        subtitle="Sélectionnez les compétences et critères pour vos travaux"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <CustomSelect
            label="Corps d’état / Spécialité"
            value={tempFilters.specialty || 'all'}
            onChange={(val) => setTempFilters({ ...tempFilters, specialty: String(val) })}
            options={SPECIALTY_OPTIONS}
            searchable={true}
            modalTitle="Spécialité BTP"
          />

          <CustomSelect
            label="Zone Géographique"
            value={tempFilters.city || 'all'}
            onChange={(val) => setTempFilters({ ...tempFilters, city: String(val) })}
            options={CITY_OPTIONS}
            searchable={true}
            modalTitle="Zone Géographique"
          />

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Type de Prestataire</label>
            <div className="flex rounded-brand border border-brand-light-border dark:border-brand-dark-border p-1 bg-slate-50 dark:bg-brand-dark">
              <button
                type="button"
                onClick={() => setTempFilters({ ...tempFilters, accountType: undefined })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                  !tempFilters.accountType
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setTempFilters({ ...tempFilters, accountType: 'entreprise' })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                  tempFilters.accountType === 'entreprise'
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Entreprises
              </button>
              <button
                type="button"
                onClick={() => setTempFilters({ ...tempFilters, accountType: 'artisan' })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                  tempFilters.accountType === 'artisan'
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Artisans
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setTempFilters({ ...tempFilters, verifiedOnly: !tempFilters.verifiedOnly })}
              className="inline-flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 select-none cursor-pointer"
            >
              {tempFilters.verifiedOnly ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Professionnels vérifiés uniquement</span>
            </button>
          </div>

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

      {/* 3. VERSION DESKTOP (md:block) : Panneau inline complet */}
      <GlassmorphismCard intensity="medium" className="hidden md:block p-5 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom d’entreprise, spécialité, mot-clé..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-2.5 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-smooth"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <CustomSelect
            label="Corps d’état / Spécialité"
            value={filters.specialty || 'all'}
            onChange={(val) => onChange({ ...filters, specialty: String(val) })}
            options={SPECIALTY_OPTIONS}
            searchable={true}
            modalTitle="Corps d’état / Spécialité"
          />

          <CustomSelect
            label="Zone Géographique"
            value={filters.city || 'all'}
            onChange={(val) => onChange({ ...filters, city: String(val) })}
            options={CITY_OPTIONS}
            searchable={true}
            modalTitle="Zone Géographique"
          />

          <div className="space-y-1 sm:col-span-2 lg:col-span-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Type de Prestataire
            </label>
            <div className="flex rounded-brand border border-brand-light-border dark:border-brand-dark-border p-0.5 bg-slate-50 dark:bg-brand-dark">
              <button
                type="button"
                onClick={() => handleAccountTypeChange('all')}
                className={`flex-1 py-1 text-xs font-semibold rounded cursor-pointer ${
                  !filters.accountType
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange('entreprise')}
                className={`flex-1 py-1 text-xs font-semibold rounded cursor-pointer ${
                  filters.accountType === 'entreprise'
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Entreprises
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange('artisan')}
                className={`flex-1 py-1 text-xs font-semibold rounded cursor-pointer ${
                  filters.accountType === 'artisan'
                    ? 'bg-brand-secondary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Artisans
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-brand-light-border dark:border-brand-dark-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={toggleVerifiedOnly}
            className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 hover:text-brand-primary transition-colors select-none cursor-pointer"
          >
            {filters.verifiedOnly ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Professionnels vérifiés uniquement</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              {totalResults} professionnel{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-brand-urgent hover:underline font-bold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};
