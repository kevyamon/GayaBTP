import React, { useMemo } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { PropertyType, LandTitleType } from '../../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../../theme/theme';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { ListingFilterValues } from './ListingFilters';

interface ListingFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempFilters: ListingFilterValues;
  setTempFilters: React.Dispatch<React.SetStateAction<ListingFilterValues>>;
  onApply: () => void;
  onReset: () => void;
}

const PROPERTY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tous les types de biens' },
  { value: 'terrain', label: 'Terrain / Parcelle', description: 'Terrains à bâtir et lotissements' },
  { value: 'maison', label: 'Maison / Villa', description: 'Villas individuelles et duplex' },
  { value: 'appartement', label: 'Appartement', description: 'Logements en copropriété' },
  { value: 'commercial', label: 'Local Commercial', description: 'Bureaux et espaces commerciaux' },
];

const TITLE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tous les titres fonciers' },
  ...LAND_TITLE_TYPES.map((t) => ({
    value: t.value,
    label: `${t.value.toUpperCase()} — ${t.label}`,
    description: t.description,
  })),
];

const SORT_OPTIONS: SelectOption[] = [
  { value: 'recent', label: 'Plus récents en premier' },
  { value: 'price_asc', label: 'Prix croissant (du - cher au + cher)' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'surface_desc', label: 'Plus grande superficie' },
];

export const ListingFiltersModal: React.FC<ListingFiltersModalProps> = ({
  isOpen,
  onClose,
  tempFilters,
  setTempFilters,
  onApply,
  onReset,
}) => {
  const activeDistricts = useMemo(() => {
    return IVORY_COAST_LOCATIONS.find((l) => l.city === tempFilters.city)?.districts || [];
  }, [tempFilters.city]);

  const cityOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: 'Toutes les villes' },
      ...IVORY_COAST_LOCATIONS.map((l) => ({
        value: l.city,
        label: l.city,
        description: `${l.districts.length} communes / secteurs`,
      })),
    ];
  }, []);

  const districtOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: 'Toutes les communes' },
      ...activeDistricts.map((d) => ({
        value: d,
        label: d,
      })),
    ];
  }, [activeDistricts]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filtres de recherche"
      subtitle="Affinez vos critères pour trouver la parcelle ou le bien idéal"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Ville / Région */}
        <CustomSelect
          label="Ville / Région"
          value={tempFilters.city}
          onChange={(val) =>
            setTempFilters({ ...tempFilters, city: String(val), district: '' })
          }
          options={cityOptions}
          searchable={true}
          modalTitle="Ville / Région"
        />

        {/* Commune / Secteur */}
        <CustomSelect
          label="Commune / Secteur"
          value={tempFilters.district}
          onChange={(val) => setTempFilters({ ...tempFilters, district: String(val) })}
          options={districtOptions}
          searchable={true}
          disabled={activeDistricts.length === 0}
          modalTitle="Commune / Secteur"
        />

        {/* Titre Foncier */}
        <CustomSelect
          label="Titre Foncier Requis"
          value={tempFilters.titleType}
          onChange={(val) =>
            setTempFilters({ ...tempFilters, titleType: val as LandTitleType | '' })
          }
          options={TITLE_OPTIONS}
          modalTitle="Titre foncier requis"
        />

        {/* Type de bien */}
        <CustomSelect
          label="Type de bien"
          value={tempFilters.propertyType}
          onChange={(val) =>
            setTempFilters({ ...tempFilters, propertyType: val as PropertyType | '' })
          }
          options={PROPERTY_OPTIONS}
          modalTitle="Type de bien immobilier"
        />

        {/* Budget maximum */}
        <div className="space-y-1">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Budget Maximum (FCFA)
          </label>
          <input
            type="number"
            placeholder="Ex : 50 000 000"
            value={tempFilters.maxPrice}
            onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
            className="w-full text-xs rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Ordre d'affichage */}
        <CustomSelect
          label="Ordre d’affichage"
          value={tempFilters.sort}
          onChange={(val) =>
            setTempFilters({ ...tempFilters, sort: val as typeof tempFilters.sort })
          }
          options={SORT_OPTIONS}
          modalTitle="Ordre d’affichage"
        />

        {/* Actions de validation */}
        <div className="pt-4 border-t border-brand-light-border dark:border-brand-dark-border flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Réinitialiser
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onApply}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </Modal>
  );
};
