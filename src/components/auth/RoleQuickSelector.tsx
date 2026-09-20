import React from 'react';
import { User, Briefcase, Building2, Compass, SlidersHorizontal } from 'lucide-react';
import { QUICK_ROLE_TYPES, QuickRoleType } from '../../types/roles';

interface RoleQuickSelectorProps {
  selectedQuickType: QuickRoleType['id'];
  selectedRole: string;
  onSelectQuickType: (typeId: QuickRoleType['id']) => void;
  onOpenRoleModal: () => void;
}

export const RoleQuickSelector: React.FC<RoleQuickSelectorProps> = ({
  selectedQuickType,
  selectedRole,
  onSelectQuickType,
  onOpenRoleModal,
}) => {
  return (
    <div className="space-y-2">
      {/* Label descriptif */}
      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
        Je suis
      </label>

      {/* Grille des 4 Cartes de Sélection Rapide */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {QUICK_ROLE_TYPES.map((type) => {
          const isSelected = selectedQuickType === type.id;
          const Icon =
            type.id === 'particulier'
              ? User
              : type.id === 'professionnel'
                ? Briefcase
                : type.id === 'entreprise'
                  ? Building2
                  : Compass;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectQuickType(type.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all duration-150 text-center cursor-pointer active:scale-95 select-none ${
                isSelected
                  ? 'bg-brand-secondary/10 dark:bg-brand-secondary/25 border-brand-secondary text-brand-secondary dark:text-white shadow-sm ring-1 ring-brand-secondary'
                  : 'bg-white/60 dark:bg-black/30 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <Icon
                className={`w-4 h-4 mb-1 shrink-0 ${
                  isSelected
                    ? 'text-brand-secondary dark:text-sky-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              />
              <span
                className={`text-[11px] leading-tight truncate w-full ${
                  isSelected ? 'font-bold text-brand-secondary dark:text-white' : 'font-semibold'
                }`}
              >
                {type.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Badge de Spécialité BTP / Foncier Précise pour les Profils Pros */}
      {selectedQuickType !== 'particulier' && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-brand-secondary/10 dark:bg-brand-secondary/20 border border-brand-secondary/30 text-xs animate-in fade-in duration-200">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">
              Spécialité BTP / Foncier :
            </span>
            <span className="font-bold text-brand-secondary dark:text-white truncate block text-[11px] sm:text-xs">
              {selectedRole}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenRoleModal}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-secondary hover:text-brand-secondary-hover dark:text-sky-300 hover:underline shrink-0 cursor-pointer p-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Changer</span>
          </button>
        </div>
      )}
    </div>
  );
};
