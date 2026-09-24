import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MapPin, Tag, ShieldCheck, ArrowRight, Loader2, FileQuestion, Edit3 } from 'lucide-react';
import { listingService } from '../../services/listing.service';
import { IListing } from '../../types';
import { EditListingModal } from './EditListingModal';

export const DashboardListingsTab: React.FC = () => {
  const [listings, setListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<IListing | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setIsLoading(true);
        // Récupération réelle des annonces de l'utilisateur connecté
        const userListings = await listingService.getMyListings();
        setListings(userListings);
      } catch {
        // En cas de secours (si pas encore d'annonces perso créées), tentative de fallback
        try {
          const fallback = await listingService.getListings({ limit: 10 });
          setListings(fallback.listings || []);
        } catch {
          setListings([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  const handleOpenEdit = (listing: IListing) => {
    setSelectedListingForEdit(listing);
    setIsEditModalOpen(true);
  };

  const handleListingUpdated = (updated: IListing) => {
    setListings((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
  };

  const handleListingDeleted = (id: string) => {
    setListings((prev) => prev.filter((l) => l._id !== id));
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
        <span className="text-xs text-slate-500">Chargement de vos annonces...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Mes Annonces Foncières & Immobilières
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gérez vos terrains et biens publiés sur la plateforme GayaBTP.
            </p>
          </div>

          <Link
            to="/publier"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-accent hover:bg-brand-accent-hover text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouvelle Annonce</span>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-brand-dark-surface border border-dashed border-brand-light-border dark:border-brand-dark-border space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Aucune annonce enregistrée pour le moment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Vous n’avez pas encore déposé d’annonce. Publiez votre première parcelle avec titre foncier vérifié.
            </p>
            <Link
              to="/publier"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-light transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Déposer une annonce</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="group rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border overflow-hidden shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-brand-dark/95 text-brand-primary shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{listing.titleType}</span>
                      </span>
                    </div>

                    {/* Bouton rapide d'édition sur la carte */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(listing)}
                      className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-[11px] font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400" />
                      <span>Modifier</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {listing.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{listing.district || listing.city} • {listing.surfaceM2.toLocaleString('fr-FR')} m²</span>
                    </div>

                    <p className="text-sm font-extrabold text-brand-accent">
                      {listing.priceFCFA.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-2">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{listing.status === 'sold' ? 'Vendu' : (listing.status === 'pending_review' || listing.status === 'pending') ? 'En examen' : 'En ligne'}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(listing)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Modifier</span>
                    </button>

                    <Link
                      to={`/annonces/${listing._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary dark:text-sky-300 hover:underline"
                    >
                      <span>Voir le bien</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale d'Édition de l'Annonce */}
      <EditListingModal
        listing={selectedListingForEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedListingForEdit(null);
        }}
        onUpdated={handleListingUpdated}
        onDeleted={handleListingDeleted}
      />
    </>
  );
};
