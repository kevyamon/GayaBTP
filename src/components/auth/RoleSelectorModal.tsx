import React, { useState, useMemo } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { getCategoryById, ROLE_CATEGORIES } from '../../types/roles';
import { Button } from '../ui/Button';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  categoryId,
  selectedRole,
  onSelectRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Récupération de la catégorie active
  const category = useMemo(() => {
    return getCategoryById(categoryId) || ROLE_CATEGORIES[1];
  }, [categoryId]);

  // Filtrage exclusif des métiers de la catégorie sélectionnée
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return category.roles;
    const q = searchQuery.toLowerCase().trim();
    return category.roles.filter((role) => role.toLowerCase().includes(q));
  }, [category, searchQuery]);

  const handleSelect = (role: string) => {
    onSelectRole(role);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sélectionnez votre métier"
      subtitle={`Catégorie : ${category.name}`}
      maxWidth="md"
    >
      <div className="space-y-3.5">
        {/* Description de la catégorie */}
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {category.description}
        </p>

        {/* Barre de Recherche rapide dans la catégorie */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Rechercher un métier dans ${category.name}...`}
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

        {/* Liste défilable des métiers exclusifs de cette catégorie */}
        <div className="space-y-1.5 max-h-[300px] sm:max-h-[340px] overflow-y-auto overscroll-contain pr-1">
          {filteredRoles.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Aucun métier trouvé pour « {searchQuery} » dans cette catégorie.
            </div>
          ) : (
            filteredRoles.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelect(role)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all cursor-pointer active:scale-[0.99] ${
                    isSelected
                      ? 'bg-brand-secondary/15 dark:bg-brand-secondary/30 border-2 border-brand-secondary text-brand-secondary dark:text-white font-bold shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/60'
                  }`}
                >
                  <span className="font-semibold text-xs sm:text-sm leading-snug">
                    {role}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-brand-secondary dark:text-sky-300 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Pied de la Modale */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
