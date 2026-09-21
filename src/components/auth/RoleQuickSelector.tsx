import React, { useRef } from 'react';
import {
  User,
  Compass,
  HardHat,
  Layers,
  Building2,
  Home,
  Scale,
  Landmark,
  Truck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ROLE_CATEGORIES, RoleCategory, getCategoryById } from '../../types/roles';

interface RoleQuickSelectorProps {
  selectedCategoryId: string;
  selectedRole: string;
  onSelectCategory: (category: RoleCategory) => void;
  onOpenRoleModal: () => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  particulier: User,
  foncier: Compass,
  btp_ingenierie: HardHat,
  architecture: Layers,
  artisans_chantier: Building2,
  immobilier: Home,
  juridique: Scale,
  finance_assurance: Landmark,
  fournisseurs_materiaux: Truck,
  formation_emploi: GraduationCap,
};

export const RoleQuickSelector: React.FC<RoleQuickSelectorProps> = ({
  selectedCategoryId,
  selectedRole,
  onSelectCategory,
  onOpenRoleModal,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentCategory = getCategoryById(selectedCategoryId) || ROLE_CATEGORIES[0];

  return (
    <div className="space-y-2.5">
      {/* En-tête avec label et indicateur de défilement */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Sélectionnez votre catégorie
        </label>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          Glissez pour voir toutes les catégories
        </span>
      </div>

      {/* Carrousel Horizontal avec Boutons Flèches */}
      <div className="relative flex items-center group">
        {/* Flèche Gauche */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-2 z-20 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-brand-secondary transition-all active:scale-95 cursor-pointer"
          aria-label="Faire défiler vers la gauche"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Piste de défilement horizontal des 10 Catégories exactes */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 w-full"
        >
          {ROLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const Icon = CATEGORY_ICONS[cat.id] || Building2;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-150 text-center cursor-pointer active:scale-95 select-none shrink-0 min-w-[148px] sm:min-w-[160px] min-h-[86px] sm:min-h-[92px] ${
                  isSelected
                    ? 'bg-brand-secondary/15 dark:bg-brand-secondary/30 border-brand-secondary text-brand-secondary dark:text-white shadow-md ring-2 ring-brand-secondary/40'
                    : 'bg-white/65 dark:bg-black/35 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-brand-secondary/40 hover:bg-white/85'
                }`}
              >
                <Icon
                  className={`w-4 h-4 mb-1.5 shrink-0 ${
                    isSelected
                      ? 'text-brand-secondary dark:text-sky-300'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span
                  className={`text-[11px] leading-tight text-center px-1 whitespace-normal break-words w-full ${
                    isSelected
                      ? 'font-bold text-brand-secondary dark:text-white'
                      : 'font-semibold text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Flèche Droite */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-2 z-20 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:text-brand-secondary transition-all active:scale-95 cursor-pointer"
          aria-label="Faire défiler vers la droite"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Badge du Métier sélectionné dans la catégorie active */}
      {selectedCategoryId !== 'particulier' && (
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-brand-secondary/10 dark:bg-brand-secondary/20 border border-brand-secondary/30 text-xs animate-in fade-in duration-200 shadow-sm">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium truncate">
              {currentCategory.name} :
            </span>
            <span className="font-bold text-brand-secondary dark:text-white truncate block text-[11px] sm:text-xs">
              {selectedRole}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenRoleModal}
            className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-brand-secondary/30 text-[11px] font-bold text-brand-secondary hover:text-brand-secondary-hover dark:text-sky-300 hover:bg-white shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Changer de métier</span>
          </button>
        </div>
      )}
    </div>
  );
};
