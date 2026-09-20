import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Briefcase, Check } from 'lucide-react';
import { JobFilterParams } from '../../services/job.service';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface JobFiltersProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  onReset: () => void;
  totalResults: number;
}

const SPECIALTY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes les spécialités' },
  { value: 'Gros Œuvre & Bâtiment', label: 'Gros Œuvre & Bâtiment', description: 'Gros œuvre, maçonnerie, béton armé et second œuvre' },
  { value: 'Topographie & Foncier', label: 'Topographie & Foncier', description: 'Bornage, levés topographiques et géodésie foncière' },
  { value: 'Voirie & Réseaux Divers (VRD)', label: 'Voirie & Réseaux Divers (VRD)', description: 'Terrassement, voiries, assainissement et canalisations' },
  { value: 'Électricité & Énergie', label: 'Électricité & Énergie', description: 'Installations BT/HT, transformateurs et énergie solaire' },
  { value: 'Plomberie & Fluides', label: 'Plomberie & Fluides', description: 'Réseaux hydrauliques, climatisation et sanitaires' },
];

const CONTRACT_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Tous les contrats' },
  { value: 'CDI', label: 'CDI (Contrat à Durée Indéterminée)' },
  { value: 'CDD', label: 'CDD (Contrat à Durée Déterminée)' },
  { value: 'Stage', label: 'Stage / PFE / Immersion Professionnelle' },
  { value: 'Prestation', label: 'Prestation / Freelance / Vacation' },
];

const CITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes les villes' },
  { value: 'Abidjan', label: 'Abidjan', description: 'Toutes communes (Cocody, Yopougon, Plateau...)' },
  { value: 'Grand-Bassam', label: 'Grand-Bassam', description: 'Zone balnéaire et Sud-Est' },
  { value: 'Yamoussoukro', label: 'Yamoussoukro', description: 'Capitale politique et région du Bélier' },
  { value: 'San-Pédro', label: 'San-Pédro', description: 'Pôle portuaire et Sud-Ouest' },
  { value: 'Bouaké', label: 'Bouaké', description: 'Région du Gbêkê et centre' },
];

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<JobFilterParams>(filters);

  useEffect(() => {
    if (isMobileModalOpen) {
      setTempFilters(filters);
    }
  }, [isMobileModalOpen, filters]);

  const activeFiltersCount = [
    Boolean(filters.specialty && filters.specialty !== 'all'),
    Boolean(filters.contractType && filters.contractType !== 'all'),
    Boolean(filters.city && filters.city !== 'all'),
  ].filter(Boolean).length;

  const hasActiveFilters = Boolean(filters.search) || activeFiltersCount > 0;

  const handleApplyMobileFilters = () => {
    onChange(tempFilters);
    setIsMobileModalOpen(false);
  };

  const handleResetMobileFilters = () => {
    const reset: JobFilterParams = {
      search: filters.search,
      specialty: 'all',
      contractType: 'all',
      city: 'all',
    };
    setTempFilters(reset);
    onChange(reset);
    setIsMobileModalOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* 1. VERSION MOBILE (< md) : Barre compacte pliable avec modal */}
      <div className="block md:hidden space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par métier, poste, entreprise..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
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
            <span>Filtrer les offres</span>
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
          {totalResults} offre{totalResults > 1 ? 's' : ''} d’emploi &amp; stage disponible{totalResults > 1 ? 's' : ''}
        </div>
      </div>

      {/* 2. MODALE POP-UP MOBILE DE FILTRES D'EMPLOI */}
      <Modal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        title="Filtres des offres d’emploi"
        subtitle="Affinez selon vos critères de spécialité, contrat et localisation"
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
            label="Type de contrat"
            value={tempFilters.contractType || 'all'}
            onChange={(val) => setTempFilters({ ...tempFilters, contractType: String(val) })}
            options={CONTRACT_OPTIONS}
            modalTitle="Type de Contrat"
          />

          <CustomSelect
            label="Ville / Localisation"
            value={tempFilters.city || 'all'}
            onChange={(val) => setTempFilters({ ...tempFilters, city: String(val) })}
            options={CITY_OPTIONS}
            searchable={true}
            modalTitle="Ville / Localisation"
          />

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
            placeholder="Rechercher par métier, poste, entreprise, compétence..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-11 pr-4 py-2.5 rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-smooth"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CustomSelect
            label="Corps d’état / Spécialité"
            value={filters.specialty || 'all'}
            onChange={(val) => onChange({ ...filters, specialty: String(val) })}
            options={SPECIALTY_OPTIONS}
            searchable={true}
            modalTitle="Spécialité BTP"
          />

          <CustomSelect
            label="Type de contrat"
            value={filters.contractType || 'all'}
            onChange={(val) => onChange({ ...filters, contractType: String(val) })}
            options={CONTRACT_OPTIONS}
            modalTitle="Type de Contrat"
          />

          <CustomSelect
            label="Ville / Localisation"
            value={filters.city || 'all'}
            onChange={(val) => onChange({ ...filters, city: String(val) })}
            options={CITY_OPTIONS}
            searchable={true}
            modalTitle="Ville / Localisation"
          />
        </div>

        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
            <span>
              {totalResults} offre{totalResults > 1 ? 's' : ''} d’emploi &amp; stage disponible{totalResults > 1 ? 's' : ''}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-brand-urgent hover:underline font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Effacer les filtres</span>
            </button>
          )}
        </div>
      </GlassmorphismCard>
    </div>
  );
};
