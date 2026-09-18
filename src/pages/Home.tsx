import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ListingCard } from '../components/listing/ListingCard';
import { PillarsSection } from '../components/home/PillarsSection';
import { AnimatedHoneycombGrid } from '../components/common/AnimatedHoneycombGrid';
import { Footer } from '../components/common/Footer';
import { listingService } from '../services/listing.service';
import { IListing, PropertyType, LandTitleType } from '../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../theme/theme';
import s1bg from '../assets/s1bg.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('Abidjan');
  const [propertyType, setPropertyType] = useState<PropertyType>('terrain');
  const [titleType, setTitleType] = useState<LandTitleType | ''>('');
  const [maxPrice, setMaxPrice] = useState('');
  const [recentListings, setRecentListings] = useState<IListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { listings } = await listingService.getListings({ limit: 4 });
        setRecentListings(listings.slice(0, 4));
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (propertyType) params.set('propertyType', propertyType);
    if (titleType) params.set('titleType', titleType);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate(`/annonces?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-full flex-1">
      <div className="space-y-16 lg:space-y-24 pb-16 lg:pb-24 flex-1">
        
        {/* 1. HERO BANNER IMMERSIF */}
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-brand-light-border/60 dark:border-brand-dark-border/60">
          {/* Arrière-plan avec Image s1bg et Overlay translucide équilibré */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={s1bg}
              alt="GayaBTP Foncier et BTP Côte d’Ivoire"
              className="w-full h-full object-cover object-center scale-105 transform transition-transform duration-700"
            />
            {/* Overlay doux préservant la netteté de l'image tout en assurant un contraste optimal */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/75 to-brand-light/95 dark:from-brand-dark/85 dark:via-brand-dark/80 dark:to-brand-dark backdrop-blur-[1px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">

              {/* Titre avec animation d'apparition en onde fluide (Rope Wave) mot par mot */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-title tracking-tight text-slate-900 dark:text-white leading-[1.15] drop-shadow-sm flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                <span className="animate-rope-wave" style={{ animationDelay: '0ms' }}>
                  Sécurisez
                </span>
                <span className="animate-rope-wave" style={{ animationDelay: '110ms' }}>
                  vos
                </span>
                <span className="animate-rope-wave text-brand-primary" style={{ animationDelay: '220ms' }}>
                  Terrains
                </span>
                <span className="animate-rope-wave" style={{ animationDelay: '330ms' }}>
                  &amp;
                </span>
                <span className="animate-rope-wave" style={{ animationDelay: '440ms' }}>
                  Projets
                </span>
                <span className="animate-rope-wave text-brand-secondary dark:text-sky-400" style={{ animationDelay: '550ms' }}>
                  BTP
                </span>
              </h1>

              <div className="space-y-3 max-w-2xl mx-auto">
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium drop-shadow-sm">
                  La plateforme ivoirienne dédiée à la transparence foncière, aux titres sécurisés (ACD/CMP) et aux professionnels du bâtiment labellisés.
                </p>

                {/* Slogan Officiel GayaBTP inséré naturellement avec une visibilité nette */}
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                  <span className="text-brand-secondary dark:text-sky-300">Gaya<span className="text-brand-primary">BTP</span></span>, le BTP et l’immobilier, connectés pour vous !
                </p>
              </div>
            </div>

            {/* Formulaire de recherche multicritère */}
            <div className="mt-10 max-w-5xl mx-auto bg-white/95 dark:bg-brand-dark-surface/95 backdrop-blur-md p-4 sm:p-6 rounded-brand-xl shadow-elevated dark:shadow-elevated-dark border border-brand-light-border dark:border-brand-dark-border">
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Type de bien
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark px-3 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="terrain">Terrain / Parcelle</option>
                    <option value="maison">Villa / Maison</option>
                    <option value="appartement">Appartement</option>
                    <option value="commercial">Local Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ville / Commune
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark px-3 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
                  >
                    {IVORY_COAST_LOCATIONS.map((l) => (
                      <option key={l.city} value={l.city}>
                        {l.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre foncier requis
                  </label>
                  <select
                    value={titleType}
                    onChange={(e) => setTitleType(e.target.value as LandTitleType | '')}
                    className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark px-3 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Budget Maximum (FCFA)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex : 25 000 000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-sm rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-slate-50 dark:bg-brand-dark px-3 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    leftIcon={<Search className="w-4 h-4" />}
                    className="h-[44px]"
                  >
                    Rechercher
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </section>

        {/* 2. SECTION 4 PILIERS MÉTIERS (ÉPAULES ARRONDIES & CUBES ORANGE D'ANGLE) */}
        <PillarsSection />

        {/* 3. DERNIÈRES ANNONCES VALIDÉES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-body text-slate-900 dark:text-white">
                Dernières Annonces Validées
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Parcelles et opportunités foncières avec coordonnées et titres vérifiés.
              </p>
            </div>
            <Link to="/annonces">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explorer toutes les annonces
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-brand-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentListings.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          )}
        </section>

        {/* 4. BANNIÈRE D'ENGAGEMENT TRANSPARENCE & SÉCURITÉ - EFFET LIQUIDE GLACE & MOTIF RUCHE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-brand-xl glass-water text-white p-8 sm:p-12 relative overflow-hidden shadow-elevated">
            {/* Reflets liquides caustiques en arrière-plan */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-accent/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-500/25 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-secondary/30 blur-2xl pointer-events-none" />

            {/* Grille de cubes en ruche animée avec onde de pulsation depuis l'angle haut droit */}
            <AnimatedHoneycombGrid />

            <div className="max-w-2xl relative z-10 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-bold font-body leading-tight text-white drop-shadow-md">
                Un Projet Foncier ou BTP en Côte d’Ivoire ?
              </h2>
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed drop-shadow-sm font-medium">
                Consultez nos fiches d’orientation vers les plateformes ministérielles et vérifiez l’authenticité des actes fonciers avant tout engagement financier.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/verification">
                  <Button variant="primary" size="md" className="shadow-lg">
                    Vérifier sur les Portails d’État
                  </Button>
                </Link>
                <Link to="/calculateur">
                  <Button variant="outline" size="md" className="border-white/50 text-white hover:bg-white/15 backdrop-blur-md shadow-sm">
                    Estimer mes Frais Notariés
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Pied de page institutionnel exclusif à l'Accueil */}
      <Footer />

    </div>
  );
};
