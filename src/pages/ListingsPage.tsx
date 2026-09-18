import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Bell, Map, List, RotateCcw } from 'lucide-react';
import { ListingCard } from '../components/listing/ListingCard';
import { MapView } from '../components/listing/MapView';
import { CreateAlertModal } from '../components/listing/CreateAlertModal';
import { Button } from '../components/ui/Button';
import { listingService, ListingFilterParams } from '../services/listing.service';
import { IListing, PropertyType, LandTitleType } from '../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../theme/theme';

export const ListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>(undefined);

  // État des filtres
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>(
    (searchParams.get('propertyType') as PropertyType) || ''
  );
  const [titleType, setTitleType] = useState<LandTitleType | ''>(
    (searchParams.get('titleType') as LandTitleType) || ''
  );
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState<'recent' | 'price_asc' | 'price_desc' | 'surface_desc'>('recent');

  const activeDistricts =
    IVORY_COAST_LOCATIONS.find((l) => l.city === city)?.districts || [];

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const params: ListingFilterParams = {
        city: city || undefined,
        district: district || undefined,
        propertyType: (propertyType as PropertyType) || undefined,
        titleType: (titleType as LandTitleType) || undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        sort,
      };
      const { listings: result } = await listingService.getListings(params);
      setListings(result);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [city, district, propertyType, titleType, maxPrice, sort]);

  const resetFilters = () => {
    setCity('');
    setDistrict('');
    setPropertyType('');
    setTitleType('');
    setMaxPrice('');
    setSort('recent');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-12 space-y-6">
      
      {/* En-tête et Bouton Créer une Alerte */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light-border dark:border-brand-dark-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white">
            Terrains & Offres Immobilières
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explorez les parcelles avec ACD, CMP et documents cadastraux en Côte d’Ivoire.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bascule Mobile Liste / Carte */}
          <div className="inline-flex rounded-brand border border-brand-light-border dark:border-brand-dark-border p-1 bg-slate-100 dark:bg-brand-dark lg:hidden">
            <button
              onClick={() => setMobileView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold ${
                mobileView === 'list'
                  ? 'bg-white dark:bg-brand-dark-surface text-brand-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
              Liste
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold ${
                mobileView === 'map'
                  ? 'bg-white dark:bg-brand-dark-surface text-brand-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Map className="w-4 h-4" />
              Carte
            </button>
          </div>

          <Button
            variant="urgent"
            size="sm"
            onClick={() => setIsAlertModalOpen(true)}
            leftIcon={<Bell className="w-4 h-4" />}
          >
            Créer une alerte
          </Button>
        </div>
      </div>

      {/* Barre de Filtres Rapides */}
      <div className="p-4 rounded-brand-lg bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ville</label>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict('');
            }}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">Toutes les villes</option>
            {IVORY_COAST_LOCATIONS.map((l) => (
              <option key={l.city} value={l.city}>
                {l.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Commune</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={activeDistricts.length === 0}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium disabled:opacity-50"
          >
            <option value="">Toutes les communes</option>
            {activeDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Titre Foncier</label>
          <select
            value={titleType}
            onChange={(e) => setTitleType(e.target.value as LandTitleType | '')}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">Tous les titres</option>
            {LAND_TITLE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.value.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Type de bien</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType | '')}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">Tous les types</option>
            <option value="terrain">Terrain</option>
            <option value="maison">Maison / Villa</option>
            <option value="appartement">Appartement</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tri par</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="w-full text-xs rounded border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="surface_desc">Plus grande surface</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full text-xs"
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* VUE SCINDÉE (SPLIT VIEW) : LISTE + CARTE INTERACTIVE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Colonne Liste d'annonces (7 cols) */}
        <div className={`lg:col-span-7 space-y-4 ${mobileView === 'map' ? 'hidden lg:block' : 'block'}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 rounded-brand-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center rounded-brand-lg border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-brand-dark-surface space-y-3">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Aucune offre ne correspond exactement à vos critères
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Modifiez vos filtres ou activez une alerte pour être averti de toute nouvelle mise en ligne.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsAlertModalOpen(true)}>
                Créer une alerte personnalisée
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listings.map((item) => (
                <ListingCard
                  key={item._id}
                  listing={item}
                  featured={item._id === selectedListingId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Colonne Carte Interactive (5 cols) */}
        <div className={`lg:col-span-5 h-[500px] lg:h-auto lg:sticky lg:top-24 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <MapView
            listings={listings}
            selectedListingId={selectedListingId}
            onSelectListing={(id) => setSelectedListingId(id)}
          />
        </div>

      </div>

      {/* Modale d'Alerte */}
      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        initialCity={city || 'Abidjan'}
        initialTitleType={titleType || undefined}
      />

    </div>
  );
};
