import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { listingService } from '../../services/listing.service';
import { PropertyType, LandTitleType } from '../../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../../theme/theme';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCity?: string;
  initialTitleType?: LandTitleType;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({
  isOpen,
  onClose,
  initialCity = 'Abidjan',
  initialTitleType,
}) => {
  const { success, error } = useToast();
  const [label, setLabel] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('terrain');
  const [city, setCity] = useState(initialCity);
  const [district, setDistrict] = useState('');
  const [titleType, setTitleType] = useState<LandTitleType | ''>(initialTitleType || '');
  const [maxPriceFCFA, setMaxPriceFCFA] = useState<string>('');
  const [minSurfaceM2, setMinSurfaceM2] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const activeDistricts =
    IVORY_COAST_LOCATIONS.find((l) => l.city === city)?.districts || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      error('Veuillez attribuer un nom à votre alerte (ex : Terrains ACD Bingerville).');
      return;
    }

    setIsLoading(true);
    try {
      await listingService.createAlert({
        label,
        propertyType,
        city,
        district: district || undefined,
        titleType: (titleType as LandTitleType) || undefined,
        maxPriceFCFA: maxPriceFCFA ? parseInt(maxPriceFCFA, 10) : undefined,
        minSurfaceM2: minSurfaceM2 ? parseInt(minSurfaceM2, 10) : undefined,
      });

      success('Alerte configurée avec succès !', 'Vous recevrez un e-mail dès qu’une nouvelle opportunité correspondante est publiée.');
      onClose();
    } catch {
      error('Impossible d’enregistrer votre alerte. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une Alerte Foncière Intelligente"
      subtitle="Recevez les nouvelles parcelles dès leur validation technique."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nom de la veille *
          </label>
          <input
            type="text"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex : Terrains ACD à Bingerville < 25M FCFA"
            className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Type de bien
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary"
            >
              <option value="terrain">Terrain / Parcelle</option>
              <option value="maison">Villa / Maison</option>
              <option value="appartement">Appartement</option>
              <option value="commercial">Local Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Titre juridique requis
            </label>
            <select
              value={titleType}
              onChange={(e) => setTitleType(e.target.value as LandTitleType | '')}
              className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Tous les titres</option>
              {LAND_TITLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ville
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setDistrict('');
              }}
              className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary"
            >
              {IVORY_COAST_LOCATIONS.map((l) => (
                <option key={l.city} value={l.city}>
                  {l.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Commune / Zone
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={activeDistricts.length === 0}
              className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
            >
              <option value="">Toute la ville</option>
              {activeDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Budget Maximum (FCFA)
            </label>
            <input
              type="number"
              value={maxPriceFCFA}
              onChange={(e) => setMaxPriceFCFA(e.target.value)}
              placeholder="Ex : 20000000"
              className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Surface Minimale (m²)
            </label>
            <input
              type="number"
              value={minSurfaceM2}
              onChange={(e) => setMinSurfaceM2(e.target.value)}
              placeholder="Ex : 500"
              className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-brand-light-border dark:border-brand-dark-border flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Bell className="w-4 h-4" />}
          >
            Activer l’alerte
          </Button>
        </div>
      </form>
    </Modal>
  );
};
