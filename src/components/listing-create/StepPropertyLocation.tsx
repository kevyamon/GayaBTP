import React, { useMemo } from 'react';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { PropertyType } from '../../types';
import { IVORY_COAST_LOCATIONS } from '../../theme/theme';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { Button } from '../ui/Button';

export interface LocationData {
  propertyType: PropertyType;
  transactionType: 'vente' | 'location';
  city: string;
  district: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

interface StepProps {
  data: LocationData;
  onChange: (data: LocationData) => void;
  onNext: () => void;
}

const PROPERTY_OPTIONS: SelectOption[] = [
  { value: 'terrain', label: 'Terrain nu / Parcelle', description: 'Terrain à bâtir, lotissement ou parcelle viabilisée' },
  { value: 'maison', label: 'Villa / Maison individuelle', description: 'Maison basse, villa duplex ou résidence' },
  { value: 'appartement', label: 'Appartement en copropriété', description: 'Logement en immeuble résidentiel' },
  { value: 'commercial', label: 'Bâtiment / Local commercial', description: 'Bureau, entrepôt ou boutique d’activité' },
];

export const StepPropertyLocation: React.FC<StepProps> = ({ data, onChange, onNext }) => {
  const activeDistricts = useMemo(() => {
    return IVORY_COAST_LOCATIONS.find((l) => l.city === data.city)?.districts || [];
  }, [data.city]);

  const cityOptions: SelectOption[] = useMemo(() => {
    return IVORY_COAST_LOCATIONS.map((l) => ({
      value: l.city,
      label: l.city,
      description: `${l.districts.length} communes et secteurs répertoriés`,
    }));
  }, []);

  const districtOptions: SelectOption[] = useMemo(() => {
    return activeDistricts.map((d) => ({
      value: d,
      label: d,
    }));
  }, [activeDistricts]);

  const handleGetCoordinates = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange({
            ...data,
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        () => {
          // Ignorer en silence
        }
      );
    }
  };

  const isComplete = data.propertyType && data.city && data.district && data.address.trim().length > 3;

  return (
    <div className="space-y-6">
      {/* 1. Type de transaction & Type de bien */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Nature de l’opération *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange({ ...data, transactionType: 'vente' })}
              className={`py-3 px-4 rounded-brand font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                data.transactionType === 'vente'
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-primary/50'
              }`}
            >
              Vente définitive
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, transactionType: 'location' })}
              className={`py-3 px-4 rounded-brand font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                data.transactionType === 'location'
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-primary/50'
              }`}
            >
              Location / Bail
            </button>
          </div>
        </div>

        <CustomSelect
          label="Typologie du bien"
          required
          value={data.propertyType}
          onChange={(val) => onChange({ ...data, propertyType: val as PropertyType })}
          options={PROPERTY_OPTIONS}
          modalTitle="Typologie du bien"
          modalSubtitle="Sélectionnez la catégorie foncière ou immobilière"
        />
      </div>

      {/* 2. Zone Géographique */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelect
          label="Ville / Région"
          required
          value={data.city}
          onChange={(val) => {
            const newCity = String(val);
            const firstDistrict = IVORY_COAST_LOCATIONS.find((l) => l.city === newCity)?.districts[0] || '';
            onChange({ ...data, city: newCity, district: firstDistrict });
          }}
          options={cityOptions}
          searchable={true}
          modalTitle="Ville en Côte d’Ivoire"
        />

        <CustomSelect
          label="Commune / Secteur"
          required
          value={data.district}
          onChange={(val) => onChange({ ...data, district: String(val) })}
          options={districtOptions}
          searchable={true}
          disabled={districtOptions.length === 0}
          modalTitle="Commune / Secteur"
        />
      </div>

      {/* 3. Adresse / Repère précis */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-brand-primary" />
          <span>Adresse ou Repère géographique *</span>
        </label>
        <input
          type="text"
          required
          placeholder="Ex : Angré 8ème Tranche, non loin du nouveau CHU, voie bitumée"
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
        />
      </div>

      {/* 4. Coordonnées GPS (Optionnelles) */}
      <div className="p-3.5 rounded-brand bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            Coordonnées GPS de la parcelle
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {data.latitude && data.longitude
              ? `Lat : ${data.latitude}, Long : ${data.longitude}`
              : 'Facilite la localisation satellite sur la carte interactive.'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGetCoordinates}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-brand bg-brand-secondary/15 text-brand-secondary hover:bg-brand-secondary/25 transition-colors cursor-pointer shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{data.latitude ? 'Actualiser le point GPS' : 'Pointer ma position GPS'}</span>
        </button>
      </div>

      {/* Bouton de progression */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!isComplete}
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="text-xs sm:text-sm px-4 sm:px-6"
        >
          <span className="hidden sm:inline">Étape suivante : </span>
          <span>Titre foncier</span>
        </Button>
      </div>
    </div>
  );
};
