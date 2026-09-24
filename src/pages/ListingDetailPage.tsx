import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Maximize2,
  ArrowLeft,
  Calendar,
  Share2,
} from 'lucide-react';
import { listingService } from '../services/listing.service';
import { IListing } from '../types';
import { ListingGallery } from '../components/listing/ListingGallery';
import { ListingLegalCard } from '../components/listing/ListingLegalCard';
import { ListingPublisherCard } from '../components/listing/ListingPublisherCard';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<IListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      listingService
        .getListingById(id)
        .then(setListing)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('success', 'Lien de l’annonce copié dans le presse-papier !');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-brand-xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Annonce introuvable
        </h2>
        <p className="text-xs text-slate-500">
          Ce bien n’est plus disponible ou a été retiré de la publication.
        </p>
        <Link to="/annonces">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Retour aux annonces
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:pb-16 space-y-8">
      
      {/* 1. BARRE HAUTE DE NAVIGATION & PARTAGE */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/annonces"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux annonces immobilières</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partager</span>
        </button>
      </div>

      {/* 2. TITRE & PRIX PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white leading-tight">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {listing.city}
                {listing.district ? ` • ${listing.district}` : ''}
                {listing.neighborhood ? ` (${listing.neighborhood})` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Superficie : {listing.surfaceM2.toLocaleString('fr-FR')} m²</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Publié le {new Date(listing.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
            Prix de vente
          </span>
          <span className="text-2xl sm:text-3xl font-title text-brand-primary">
            {listing.priceFCFA.toLocaleString('fr-FR')}&nbsp;FCFA
          </span>
        </div>
      </div>

      {/* 3. GALERIE PHOTOS */}
      <ListingGallery
        images={listing.images}
        title={listing.title}
        titleType={listing.titleType}
        propertyType={listing.propertyType}
      />

      {/* 4. CONTENU : DESCRIPTION + ENCADRÉ JURIDIQUE & CONTACT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Descriptif & Caractéristiques */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-2xl sm:rounded-3xl p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Description du bien
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-2xl sm:rounded-3xl p-6 space-y-4 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fiche Récapitulative
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-dark space-y-1">
                <span className="text-slate-400 block">Type d’opération</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {listing.transactionType || 'Vente'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-dark space-y-1">
                <span className="text-slate-400 block">Superficie nette</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {listing.surfaceM2} m²
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-dark space-y-1">
                <span className="text-slate-400 block">Titre foncier</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {listing.titleType}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-dark space-y-1">
                <span className="text-slate-400 block">Commune / Ville</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {listing.city}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-dark space-y-1">
                <span className="text-slate-400 block">Quartier</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {listing.district || listing.neighborhood || 'Centre'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-brand-dark space-y-1">
                <span className="text-slate-400 block">Référence Gaya</span>
                <span className="font-bold text-brand-primary">
                  {listing._id.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Colonne Droite : Carte Auteur / Vendeur avec Voir le profil & Encadré Légal */}
        <div className="space-y-6">
          
          {/* Carte du profil de l'auteur / vendeur avec "Voir le profil" */}
          <ListingPublisherCard listing={listing} />

          {/* Encadré d'estimation légale & frais fonciers */}
          <ListingLegalCard listing={listing} />

        </div>

      </div>

    </div>
  );
};
