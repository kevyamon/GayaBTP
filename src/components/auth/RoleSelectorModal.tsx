import React, { useState, useMemo } from 'react';
import { Search, Check, ChevronRight } from 'lucide-react';
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

  // Filtrage intelligent selon la recherche textuelle
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
      title="Sélectionnez votre métier ou rôle BTP"
      subtitle="Choisissez la spécialité exacte correspondant à votre profil"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* 1. Barre de Recherche Rapide */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par métier (ex: Géomètre, Architecte, Maçon, BET...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            autoFocus
          />
        </div>

        {/* 2. Affichage des résultats filtrés ou des catégories par onglets */}
        {searchResults ? (
          /* Liste de recherche globale */
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
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
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary/15 border border-brand-primary text-brand-primary font-bold shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{role}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {category.name}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-primary" />}
                </button>
              );
            })}
          </div>
        ) : (
          /* Navigation par Catégories */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 max-h-[340px] overflow-hidden">
            {/* Liste des 10 Catégories à gauche */}
            <div className="md:col-span-5 space-y-1 overflow-y-auto max-h-[140px] md:max-h-[340px] pr-1">
              {ROLE_CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-primary text-white font-bold shadow-sm'
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

            {/* Liste des rôles de la catégorie active à droite */}
            <div className="md:col-span-7 space-y-1.5 overflow-y-auto max-h-[190px] md:max-h-[340px] pl-1 pr-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 py-1">
                {activeCategory.description}
              </div>

              {activeCategory.roles.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelect(role, activeCategory.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary/15 border border-brand-primary text-brand-primary font-bold shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/40'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <Check className="w-4 h-4 text-brand-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Pied de la Modale */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
