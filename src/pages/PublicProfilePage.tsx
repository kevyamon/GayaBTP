import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Building,
  CheckCircle2,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  ArrowLeft,
  Loader2,
  Tag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { userService, IPublicUserProfile } from '../services/user.service';
import { listingService } from '../services/listing.service';
import { IListing } from '../types';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80';

export const PublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<IPublicUserProfile | null>(null);
  const [userListings, setUserListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    Promise.all([
      userService.getPublicProfile(id),
      listingService.getListings({ limit: 20 }),
    ])
      .then(([prof, listingsRes]) => {
        setProfileData(prof);
        if (prof?.listings && prof.listings.length > 0) {
          setUserListings(prof.listings as IListing[]);
        } else if (listingsRes.listings) {
          const matching = listingsRes.listings.filter(
            (l) => l.userId === id || (typeof l.ownerId === 'string' && l.ownerId === id)
          );
          setUserListings(matching.length > 0 ? matching : listingsRes.listings.slice(0, 2));
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span className="text-xs text-slate-500 font-medium">Chargement du profil...</span>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profil introuvable</h2>
        <p className="text-xs text-slate-500">Cet utilisateur n’est plus actif ou n’existe pas.</p>
        <Link
          to="/annonces"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux annonces</span>
        </Link>
      </div>
    );
  }

  const { user, proProfile } = profileData;
  const isPro = user.role === 'professionnel';
  const isVerified = Boolean(proProfile?.isVerified);
  const coverUrl = user.coverImage || DEFAULT_COVER;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '2025';

  const whatsappUrl = user.phone
    ? `https://wa.me/${user.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour ${user.name}, je vous contacte suite à votre profil sur GayaBTP.`
      )}`
    : undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-6">
      
      {/* Bouton retour */}
      <Link
        to="/annonces"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux annonces</span>
      </Link>

      {/* Carte Profil Header (Bannière & Avatar style Facebook) */}
      <div className="bg-white dark:bg-brand-dark-surface rounded-2xl sm:rounded-3xl border border-brand-light-border dark:border-brand-dark-border shadow-soft overflow-hidden">
        <div className="relative h-44 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img src={coverUrl} alt="Couverture" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-primary-light flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white dark:ring-brand-dark-surface shadow-lg overflow-hidden shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.slice(0, 2).toUpperCase() || <User className="w-12 h-12" />
                )}
              </div>
            </div>

            {/* Actions de contact */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              {user.phone && (
                <a
                  href={`tel:${user.phone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-light text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-sky-300">
                {isPro ? <><Building className="w-3.5 h-3.5" /><span>Professionnel BTP</span></> : <><User className="w-3.5 h-3.5" /><span>Particulier</span></>}
              </span>
              {isPro && isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Certifié Conforme</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {user.city && (
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /><span>{user.city}</span></span>
              )}
              {user.email && (
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /><span>{user.email}</span></span>
              )}
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /><span>Membre depuis {memberSince}</span></span>
            </div>

            {isPro && proProfile?.companyName && (
              <p className="text-xs sm:text-sm font-semibold text-brand-primary dark:text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Entreprise : {proProfile.companyName}</span>
                {proProfile.yearsOfExperience ? ` • ${proProfile.yearsOfExperience} ans d'expérience` : ''}
              </p>
            )}

            {user.bio && (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1 leading-relaxed bg-slate-50 dark:bg-black/20 p-3.5 rounded-2xl border border-slate-100 dark:border-white/5">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Annonces publiées par ce membre */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-primary" />
            <span>Biens et parcelles publiés par {user.name} ({userListings.length})</span>
          </h2>
        </div>

        {userListings.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border text-xs text-slate-500">
            Aucun autre bien disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userListings.map((listing) => (
              <Link
                key={listing._id}
                to={`/annonces/${listing._id}`}
                className="group rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border overflow-hidden shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-brand-dark/95 text-brand-primary shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{listing.titleType}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{listing.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{listing.district || listing.city} • {listing.surfaceM2.toLocaleString('fr-FR')} m²</span>
                    </div>
                    <p className="text-sm font-extrabold text-brand-accent">{listing.priceFCFA.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-2">
                  <span className="text-[11px] font-semibold text-emerald-600">En ligne</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary dark:text-sky-300">
                    <span>Consulter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
