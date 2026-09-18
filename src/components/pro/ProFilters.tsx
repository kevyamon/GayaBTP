import React from 'react';
import { Search, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { ProFilterParams } from '../../services/pro.service';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

interface ProFiltersProps {
  filters: ProFilterParams;
  onChange: (filters: ProFilterParams) => void;
  onReset: () => void;
  totalResults: number;
}

const SPECIALTY_OPTIONS = [
  { value: 'all', label: 'Toutes les spécialités' },
  { value: 'Géomètre-Expert', label: 'Géomètres-Experts (OGECI)' },
  { value: 'Architecte', label: 'Architectes (CNOA)' },
  { value: 'Gros Œuvre', label: 'Gros Œuvre, Maçonnerie & VRD' },
  { value: 'Électricité', label: 'Électricité Bâtiment & Solaire' },
  { value: 'Plomberie', label: 'Plomberie & Fluides Sanitaires' },
  { value: 'Topographie', label: 'Topographie & Bornage Foncier' },
  { value: 'Suivi de Chantier', label: 'Maîtrise d’Œuvre & Contrôle' },
];

const CITY_OPTIONS = [
  { value: 'all', label: 'Toutes les villes & communes' },
  { value: 'Abidjan', label: 'Abidjan (Toutes communes)' },
  { value: 'Grand-Bassam', label: 'Grand-Bassam' },
  { value: 'Yamoussoukro', label: 'Yamoussoukro' },
  { value: 'San-Pédro', label: 'San-Pédro' },
  { value: 'Bouaké', label: 'Bouaké' },
  { value: 'Korhogo', label: 'Korhogo' },
];

export const ProFilters: React.FC<ProFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, specialty: e.target.value });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, city: e.target.value });
  };

  const handleAccountTypeChange = (type: 'all' | 'entreprise' | 'artisan') => {
    onChange({ ...filters, accountType: type === 'all' ? undefined : type });
  };

  const toggleVerifiedOnly = () => {
    onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    (filters.specialty && filters.specialty !== 'all') ||
    (filters.city && filters.city !== 'all') ||
    Boolean(filters.accountType) ||
    Boolean(filters.verifiedOnly);

  return (
    <GlassmorphismCard intensity="medium" className="p-5 space-y-4">
      
      {/* Barre de recherche textuelle principale */}
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

      {/* Grille des sélecteurs de filtres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* Sélecteur Spécialités */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Corps d’état / Spécialité
          </label>
          <select
            value={filters.specialty || 'all'}
            onChange={handleSpecialtyChange}
            className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {SPECIALTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sélecteur Villes */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Zone Géographique
          </label>
          <select
            value={filters.city || 'all'}
            onChange={handleCityChange}
            className="w-full px-3 py-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {CITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type de structure (Entreprise / Artisan) */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Type de Prestataire
          </label>
          <div className="flex rounded-brand border border-brand-light-border dark:border-brand-dark-border p-0.5 bg-slate-50 dark:bg-brand-dark">
            <button
              type="button"
              onClick={() => handleAccountTypeChange('all')}
              className={`flex-1 py-1 text-xs font-semibold rounded ${
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
              className={`flex-1 py-1 text-xs font-semibold rounded ${
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
              className={`flex-1 py-1 text-xs font-semibold rounded ${
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

      {/* Barre basse : Case Vérifiés uniquement + Compteur & Réinitialisation */}
      <div className="pt-2 border-t border-brand-light-border dark:border-brand-dark-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={toggleVerifiedOnly}
          className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 hover:text-brand-primary transition-colors select-none"
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
              className="inline-flex items-center gap-1 text-brand-urgent hover:underline font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

    </GlassmorphismCard>
  );
};
