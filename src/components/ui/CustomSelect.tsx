import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { Modal } from './Modal';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  label?: string;
  value: string | number;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  modalTitle?: string;
  modalSubtitle?: string;
  leftIcon?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  buttonClassName?: string;
  required?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Sélectionner une option',
  modalTitle,
  modalSubtitle,
  leftIcon,
  searchable,
  searchPlaceholder = 'Rechercher une option...',
  disabled = false,
  error,
  className = '',
  buttonClassName = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Détection de l'option actuellement sélectionnée
  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  // Filtrage dynamique pour les longues listes (villes, communes, métiers)
  const isSearchActive = searchable !== undefined ? searchable : options.length >= 6;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.description && opt.description.toLowerCase().includes(query))
    );
  }, [options, searchQuery]);

  const handleSelect = (optValue: string | number) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const effectiveModalTitle = modalTitle || label || 'Sélectionner une option';

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label du champ s'il est fourni */}
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{label}</span>
          {required && <span className="text-brand-urgent">*</span>}
        </label>
      )}

      {/* Bouton déclencheur customisé (Remplace le select natif) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:border-brand-primary/50 text-left shadow-sm ${buttonClassName}`}
        aria-haspopup="dialog"
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          {!label && leftIcon && <span className="text-slate-400 shrink-0">{leftIcon}</span>}
          {selectedOption ? (
            <div className="flex items-center gap-2 min-w-0 truncate">
              {selectedOption.icon && (
                <span className="shrink-0 text-brand-primary">{selectedOption.icon}</span>
              )}
              <span className="truncate">{selectedOption.label}</span>
              {selectedOption.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-primary/10 text-brand-primary shrink-0">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200" />
      </button>

      {error && <p className="text-[11px] text-brand-urgent font-medium">{error}</p>}

      {/* Modale Popup Personnalisée conforme à la DA GayaBTP */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery('');
        }}
        title={effectiveModalTitle}
        subtitle={modalSubtitle || 'Sélectionnez un élément dans la liste ci-dessous'}
        icon={leftIcon}
        maxWidth="sm"
      >
        <div className="space-y-3">
          {/* Barre de recherche intégrée si activée */}
          {isSearchActive && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                autoFocus
              />
            </div>
          )}

          {/* Liste des options défilable avec scroll stylisé */}
          <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-brand text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-brand-primary/10 border-brand-primary dark:bg-brand-primary/20 text-slate-900 dark:text-white font-bold shadow-sm'
                        : 'bg-white/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {opt.icon && (
                        <span className={isSelected ? 'text-brand-primary' : 'text-slate-400'}>
                          {opt.icon}
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs truncate">{opt.label}</span>
                          {opt.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-secondary/15 text-brand-secondary font-bold">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal line-clamp-1 mt-0.5">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Indicateur Radio Personnalisé */}
                    <div className="shrink-0 flex items-center justify-center">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-brand-primary" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-6 px-4 text-xs text-slate-500 dark:text-slate-400">
                Aucun résultat pour &laquo;&nbsp;{searchQuery}&nbsp;&raquo;
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
