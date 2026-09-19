import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Bell, Map, List } from 'lucide-react';
import { ListingCard } from '../components/listing/ListingCard';
import { MapView } from '../components/listing/MapView';
import { CreateAlertModal } from '../components/listing/CreateAlertModal';
import { ListingFilters, ListingFilterValues } from '../components/listing/ListingFilters';
import { Button } from '../components/ui/Button';
import { listingService, ListingFilterParams } from '../services/listing.service';
import { IListing, PropertyType, LandTitleType } from '../types';

export const ListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>(undefined);

  // État unifié des filtres
  const [filters, setFilters] = useState<ListingFilterValues>({
    city: searchParams.get('city') || '',
    district: searchParams.get('district') || '',
    propertyType: (searchParams.get('propertyType') as PropertyType) || '',
    titleType: (searchParams.get('titleType') as LandTitleType) || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: 'recent',
    search: searchParams.get('search') || '',
  });

  const fetchListings = useCallback(async (currentFilters: ListingFilterValues) => {
    setIsLoading(true);
    try {
      const params: ListingFilterParams = {
        city: currentFilters.city || undefined,
        district: currentFilters.district || undefined,
        propertyType: (currentFilters.propertyType as PropertyType) || undefined,
        titleType: (currentFilters.titleType as LandTitleType) || undefined,
        maxPrice: currentFilters.maxPrice ? parseInt(currentFilters.maxPrice, 10) : undefined,
        sort: currentFilters.sort,
        search: currentFilters.search || undefined,
      };
      const { listings: result } = await listingService.getListings(params);
      setListings(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(filters);
  }, [filters, fetchListings]);

  const handleFilterChange = (newFilters: ListingFilterValues) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    const resetValues: ListingFilterValues = {
      city: '',
      district: '',
      propertyType: '',
      titleType: '',
      maxPrice: '',
      sort: 'recent',
      search: '',
    };
    setFilters(resetValues);
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

      {/* Barre de Filtres Complète (Desktop en ligne & Mobile modale repliée) */}
      <ListingFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={listings.length}
      />

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
        initialCity={filters.city || 'Abidjan'}
        initialTitleType={filters.titleType || undefined}
      />

    </div>
  );
};
