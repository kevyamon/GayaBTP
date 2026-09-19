import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Phone, MessageCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { IListing } from '../../types';
import { Button } from '../ui/Button';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { formatFCFA, formatSurface } from '../../theme/theme';

interface ListingCardProps {
  listing: IListing;
  featured?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, featured = false }) => {
  const isTopSecurity = listing.titleType === 'ACD' || listing.titleType === 'CMP';
  const whatsappUrl = listing.contactWhatsApp
    ? `https://wa.me/${listing.contactWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour, je vous contacte depuis GayaBTP au sujet de votre offre : "${listing.title}" (${formatFCFA(listing.priceFCFA)})`
      )}`
    : null;

  return (
    <div className="relative group h-full flex flex-col">
      {/* Orbes de diffusion et réfraction d'arrière-plan */}
      <div className="absolute top-2 left-2 w-32 h-32 rounded-full bg-brand-accent/35 dark:bg-brand-accent/25 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute bottom-2 right-2 w-36 h-36 rounded-full bg-brand-primary/30 dark:bg-brand-primary/20 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <GlassmorphismCard
        intensity="medium"
        interactive
        className={`flex flex-col justify-between flex-1 relative z-10 !border-2 !border-brand-primary dark:!border-brand-primary shadow-sm hover:!border-brand-primary-hover transition-colors ${
          featured ? 'ring-2 ring-brand-accent' : ''
        }`}
      >
        {/* Badge d’angle Titre Sécurisé — Positionné à l'angle supérieur droit */}
        {isTopSecurity && (
          <div
            className="absolute top-0 right-0 z-30 flex items-center gap-1.5 pl-3.5 pr-3 pt-1.5 pb-1.5 rounded-bl-2xl bg-brand-accent text-slate-900 font-bold text-[11px] shadow-sm tracking-tight border-b border-l border-white/60 dark:border-white/20 select-none backdrop-blur-sm"
            title="Titre foncier de premier ordre (ACD ou CMP certifié)"
          >
            <Check className="w-3.5 h-3.5 stroke-[3] text-slate-900" />
            <span>Titre Sécurisé</span>
          </div>
        )}

        {/* 1. Zone Visuelle : Image avec dégradé et informations d'identification */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Badges de typologie foncière */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-primary text-white shadow-sm">
              {listing.titleType.toUpperCase()}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-900/60 text-white backdrop-blur-md border border-white/20">
              {listing.propertyType.toUpperCase()}
            </span>
          </div>

          {/* Prix FCFA et Surface */}
          <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between z-20">
            <span className="text-base sm:text-lg font-title text-white tracking-wide drop-shadow-md">
              {formatFCFA(listing.priceFCFA)}
            </span>
            <span className="text-xs font-semibold text-slate-100 bg-slate-900/75 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/15">
              <Maximize2 className="w-3 h-3 text-brand-primary" />
              {formatSurface(listing.surfaceM2)}
            </span>
          </div>
        </div>

        {/* 2. Contenu descriptif et métadonnées */}
        <div className="p-5 flex flex-col justify-between space-y-4 flex-1">
          <div className="space-y-2.5">
            {/* Localisation */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span className="truncate">
                {listing.district ? `${listing.district}, ` : ''}{listing.city}
                {listing.neighborhood ? ` (${listing.neighborhood})` : ''}
              </span>
            </div>

            {/* Titre de l'annonce */}
            <Link to={`/annonces/${listing._id}`} className="block group/title">
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover/title:text-brand-primary dark:group-hover/title:text-brand-primary transition-colors line-clamp-2 leading-snug">
                {listing.title}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* 3. Actions directes : Consultation, WhatsApp & Téléphone */}
          <div className="pt-3 border-t border-white/40 dark:border-white/10 flex items-center gap-2">
            <Link to={`/annonces/${listing._id}`} className="flex-1">
              <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Consulter
              </Button>
            </Link>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-brand bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-colors border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm"
                title="Échanger directement par WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}

            {listing.contactPhone && (
              <a
                href={`tel:${listing.contactPhone}`}
                className="p-2 rounded-brand bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 transition-colors border border-white/60 dark:border-white/10 backdrop-blur-sm"
                title="Appeler le vendeur"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};
