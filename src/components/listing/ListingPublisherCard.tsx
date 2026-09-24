import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Building,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { IListing, IListingOwner } from '../../types';

interface ListingPublisherCardProps {
  listing: IListing;
}

export const ListingPublisherCard: React.FC<ListingPublisherCardProps> = ({ listing }) => {
  const ownerObj: Partial<IListingOwner> | null =
    typeof listing.ownerId === 'object' && listing.ownerId !== null
      ? listing.ownerId
      : null;

  const publisherId =
    ownerObj?._id || (typeof listing.ownerId === 'string' ? listing.ownerId : listing.userId) || 'usr-001';

  const publisherName = ownerObj?.name || 'Vendeur / Propriétaire';
  const publisherAvatar = ownerObj?.avatar || ownerObj?.avatarUrl;
  const publisherRole = ownerObj?.role || 'particulier';
  const publisherCity = ownerObj?.city || listing.district || listing.city;
  const isVerifiedPro = publisherRole === 'professionnel' || ownerObj?.isVerified;

  const phone = listing.contactPhone || ownerObj?.phone;
  const whatsapp = listing.contactWhatsApp || phone;

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour, je vous contacte au sujet de votre annonce "${listing.title}" vue sur GayaBTP (Réf : ${listing._id}).`
      )}`
    : undefined;

  return (
    <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-5 shadow-soft">
      
      {/* En-tête profil auteur (style Facebook / réseau pro) */}
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-primary-light text-white font-bold text-lg flex items-center justify-center overflow-hidden ring-2 ring-brand-primary/20 shadow-sm shrink-0">
            {publisherAvatar ? (
              <img src={publisherAvatar} alt={publisherName} className="w-full h-full object-cover" />
            ) : (
              publisherName.slice(0, 2).toUpperCase() || <User className="w-6 h-6" />
            )}
          </div>
          {isVerifiedPro && (
            <div
              className="absolute -bottom-1 -right-1 bg-white dark:bg-brand-dark-surface rounded-full p-0.5 shadow"
              title="Compte Professionnel Vérifié"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {publisherName}
            </h4>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary dark:text-sky-300">
              {publisherRole === 'professionnel' ? (
                <>
                  <Building className="w-3 h-3" />
                  <span>Professionnel BTP</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  <span>Particulier</span>
                </>
              )}
            </span>

            {publisherCity && (
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                <span>{publisherCity}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bouton Voir le profil public */}
      <Link
        to={`/profil/${publisherId}`}
        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-brand-primary dark:hover:border-brand-primary bg-slate-50 dark:bg-black/20 hover:bg-brand-primary/5 text-slate-700 dark:text-slate-200 hover:text-brand-primary dark:hover:text-sky-300 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer group"
      >
        <User className="w-4 h-4 text-brand-primary transition-transform group-hover:scale-110" />
        <span>Voir le profil</span>
        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-primary ml-auto" />
      </Link>

      {/* Boutons d'interaction rapide (WhatsApp & Téléphone) */}
      <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/5">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discuter sur WhatsApp</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler le propriétaire</span>
          </a>
        )}
      </div>

    </div>
  );
};
