import React, { useState, useMemo } from 'react';
import { Search, Check, ChevronRight, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ROLE_CATEGORIES, RoleCategory } from '../../types/roles';
import { Button } from '../ui/Button';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: string;
  onSelectRole: (role: string, categoryId: string) => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedRole,
  onSelectRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>(ROLE_CATEGORIES[0].id);

  // Recherche textuelle filtrée instantanément
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    const results: Array<{ role: string; category: RoleCategory }> = [];

    ROLE_CATEGORIES.forEach((cat) => {
      cat.roles.forEach((r) => {
        if (r.toLowerCase().includes(query) || cat.name.toLowerCase().includes(query)) {
          results.push({ role: r, category: cat });
        }
      });
    });

    return results;
  }, [searchQuery]);

  const activeCategory = useMemo(() => {
    return (
      ROLE_CATEGORIES.find((c) => c.id === activeCategoryId) || ROLE_CATEGORIES[0]
    );
  }, [activeCategoryId]);

  const handleSelect = (role: string, categoryId: string) => {
    onSelectRole(role, categoryId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionnez votre métier BTP"
      subtitle="Choisissez la spécialité exacte correspondant à votre activité"
      maxWidth="lg"
    >
      <div className="space-y-3.5">
        {/* 1. Barre de Recherche avec effacement rapide */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher (ex: Géomètre, Architecte, Maçon, BET...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Effacer la recherche"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 2. Affichage conditionnel : Résultats de recherche OU Navigation par Catégories */}
        {searchResults ? (
          /* A. Liste des résultats de recherche */
          <div className="space-y-1.5 max-h-[340px] overflow-y-auto overscroll-contain pr-1">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé
              {searchResults.length > 1 ? 's' : ''}
            </p>
            {searchResults.map(({ role, category }) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={`${category.id}-${role}`}
                  type="button"
                  onClick={() => handleSelect(role, category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-secondary/10 dark:bg-brand-secondary/25 border border-brand-secondary text-brand-secondary dark:text-white font-bold shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs sm:text-sm">{role}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {category.name}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-secondary dark:text-sky-300" />}
                </button>
              );
            })}
          </div>
        ) : (
          /* B. Navigation par Catégories (Adaptée Mobile & Ordinateur) */
          <div className="space-y-3">
            {/* Chips Horizontaux défilables sur Mobile (< md) */}
            <div className="flex md:hidden overflow-x-auto no-scrollbar gap-1.5 pb-1">
              {ROLE_CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-brand-secondary text-white font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Disposition 2 Colonnes sur Ordinateur (md:) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 max-h-[360px] overflow-hidden">
              {/* Colonne gauche des Catégories (Visible uniquement sur Desktop) */}
              <div className="hidden md:block md:col-span-5 space-y-1 overflow-y-auto max-h-[360px] pr-1">
                {ROLE_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategoryId(cat.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-brand-secondary text-white font-bold shadow-sm'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Colonne droite des Rôles (Mobile & Desktop) */}
              <div className="md:col-span-7 space-y-1.5 overflow-y-auto max-h-[280px] md:max-h-[360px] pl-0.5 pr-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1 pb-1">
                  {activeCategory.description}
                </div>

                <div className="space-y-1">
                  {activeCategory.roles.map((role) => {
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleSelect(role, activeCategory.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer active:scale-[0.99] ${
                          isSelected
                            ? 'bg-brand-secondary/10 dark:bg-brand-secondary/25 border border-brand-secondary text-brand-secondary dark:text-white font-bold shadow-sm'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/60'
                        }`}
                      >
                        <span className="font-medium text-xs">{role}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-brand-secondary dark:text-sky-300 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Pied de la Modale */}
        <div className="pt-2.5 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
