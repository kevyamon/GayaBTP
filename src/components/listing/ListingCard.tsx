import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Phone, MessageCircle } from 'lucide-react';
import { IListing } from '../../types';
import { Badge } from '../ui/Badge';
import { formatFCFA, formatSurface } from '../../theme/theme';

interface ListingCardProps {
  listing: IListing;
  featured?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, featured = false }) => {
  const isTopSecurity = listing.titleType === 'ACD' || listing.titleType === 'CMP';
  const whatsappUrl = listing.contactWhatsApp
    ? `https://wa.me/${listing.contactWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour, je vous contacte depuis GayaBTP au sujet de votre annonce : "${listing.title}" (${formatFCFA(listing.priceFCFA)})`
      )}`
    : null;

  return (
    <div
      className={`group flex flex-col rounded-brand-lg overflow-hidden border bg-white dark:bg-brand-dark-surface border-brand-light-border dark:border-brand-dark-border shadow-card dark:shadow-card-dark hover:shadow-elevated dark:hover:shadow-elevated-dark transition-smooth ${
        featured ? 'ring-2 ring-brand-primary' : ''
      }`}
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Badge Titre Foncier */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge
            variant={isTopSecurity ? 'verified' : 'secondary'}
            size="sm"
            icon={isTopSecurity}
          >
            {listing.titleType.toUpperCase()}
          </Badge>
          <Badge variant="outline" size="sm" className="bg-slate-900/60 text-white border-transparent backdrop-blur-sm">
            {listing.propertyType.toUpperCase()}
          </Badge>
        </div>

        {/* Prix en FCFA sur l'image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
          <span className="text-lg sm:text-xl font-title text-white tracking-wide drop-shadow-md">
            {formatFCFA(listing.priceFCFA)}
          </span>
          <span className="text-xs font-semibold text-slate-200 bg-slate-900/70 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-brand-primary" />
            {formatSurface(listing.surfaceM2)}
          </span>
        </div>
      </div>

      {/* Détails et Localisation */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="truncate">
              {listing.district ? `${listing.district}, ` : ''}{listing.city}
              {listing.neighborhood ? ` (${listing.neighborhood})` : ''}
            </span>
          </div>

          <Link to={`/annonces/${listing._id}`} className="block">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
              {listing.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Actions directes : Appel & WhatsApp */}
        <div className="pt-3 border-t border-brand-light-border dark:border-brand-dark-border flex items-center gap-2">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-brand text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
              title="Échanger directement par WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}
          <a
            href={`tel:${listing.contactPhone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-brand text-xs font-semibold border border-brand-secondary text-brand-secondary dark:text-sky-300 dark:border-sky-500/40 hover:bg-brand-secondary-light dark:hover:bg-brand-secondary/20 transition-colors"
            title="Appeler le vendeur"
          >
            <Phone className="w-3.5 h-3.5" />
            Appeler
          </a>
        </div>
      </div>
    </div>
  );
};
