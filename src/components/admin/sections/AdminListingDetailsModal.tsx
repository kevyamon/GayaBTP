import React, { useState } from 'react';
import {
  X,
  MapPin,
  Tag,
  ShieldCheck,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Archive,
  Loader2,
} from 'lucide-react';
import { IListing, IListingOwner } from '../../../types';

interface AdminListingDetailsModalProps {
  listing: IListing | null;
  isOpen: boolean;
  onClose: () => void;
  onModerate: (listingId: string, status: 'published' | 'rejected' | 'archived') => Promise<void>;
}

export const AdminListingDetailsModal: React.FC<AdminListingDetailsModalProps> = ({
  listing,
  isOpen,
  onClose,
  onModerate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleAction = async (status: 'published' | 'rejected' | 'archived') => {
    setIsSubmitting(true);
    try {
      await onModerate(listing._id, status);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const owner =
    typeof listing.ownerId === 'object' && listing.ownerId !== null
      ? (listing.ownerId as IListingOwner)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
              Inspection d’annonce foncière
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
              {listing.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps défilable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Galerie Photos */}
          {listing.images && listing.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {listing.images.map((photo: string, idx: number) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-28 object-cover rounded-2xl border border-slate-200 dark:border-white/10"
                />
              ))}
            </div>
          )}

          {/* Grille d'informations clés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-white/5 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Tag className="w-4 h-4 text-brand-secondary" />
              <span>
                Prix : <strong className="text-slate-900 dark:text-white">{listing.priceFCFA.toLocaleString('fr-FR')} FCFA</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-brand-secondary" />
              <span>
                Lieu : <strong className="text-slate-900 dark:text-white">{listing.city} ({listing.district || 'Non précisé'})</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                Titre : <strong className="text-slate-900 dark:text-white uppercase">{listing.titleType || 'ACD'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span>Superficie : <strong className="text-slate-900 dark:text-white">{listing.surfaceM2 ? `${listing.surfaceM2} m²` : 'N/A'}</strong></span>
            </div>
          </div>

          {/* Description complète */}
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Description détaillée</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200/60 dark:border-white/10 whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Coordonnées du déclarant */}
          {owner && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Dépositaire de l’annonce
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                <p>Nom : <strong className="text-slate-900 dark:text-white">{owner.name}</strong></p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {owner.email}</p>
                {owner.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {owner.phone}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Barre d'actions d'administration */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => handleAction('archived')}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            <span>Archiver</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction('rejected')}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Refuser</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction('published')}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>Approuver &amp; Mettre en ligne</span>
          </button>
        </div>
      </div>
    </div>
  );
};

