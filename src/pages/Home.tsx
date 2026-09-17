import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, HardHat, Calculator, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ListingCard } from '../components/listing/ListingCard';
import { listingService } from '../services/listing.service';
import { IListing, PropertyType, LandTitleType } from '../types';
import { IVORY_COAST_LOCATIONS, LAND_TITLE_TYPES } from '../theme/theme';

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

  const pillars = [
    {
      title: 'Terrains Sécurisés (ACD & CMP)',
      description: 'Acquérez des parcelles auditées avec titres inattaquables et bornage certifié.',
      icon: ShieldCheck,
      link: '/annonces?titleType=ACD',
      colorClass: 'text-brand-secondary bg-brand-secondary-light dark:bg-brand-secondary/20',
    },
    {
      title: 'Hub de Vérification Étatique',
      description: 'Accédez aux registres officiels de l’État : IDUFCI, DGI Livre Foncier et MCLU.',
      icon: ExternalLink,
      link: '/verification',
      colorClass: 'text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20',
    },
    {
      title: 'Artisans & Bureaux BTP Labellisés',
      description: 'Consultez des maçons, architectes et géomètres au Badge Professionnel Vérifié.',
      icon: HardHat,
      link: '/pros',
      colorClass: 'text-brand-accent-hover bg-brand-accent-light dark:bg-brand-accent/20',
    },
    {
      title: 'Simulateur de Frais Notariés & DGI',
      description: 'Calculez au centime près les frais d acquisition et droits d enregistrement.',
      icon: Calculator,
      link: '/calculateur',
      colorClass: 'text-brand-urgent bg-amber-100 dark:bg-amber-950/30',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* 1. HERO BANNER IMMERSIF */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-secondary/15 via-white to-brand-light dark:from-brand-dark-surface dark:via-brand-dark dark:to-brand-dark pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-brand-light-border dark:border-brand-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-title tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Sécurisez vos <span className="text-brand-primary">Terrains</span> & Projets <span className="text-brand-secondary dark:text-sky-400">BTP</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              La plateforme ivoirienne dédiée à la transparence foncière, aux titres sécurisés (ACD/CMP) et aux professionnels du bâtiment labellisés.
            </p>
          </div>

          {/* Formulaire de recherche multicritère */}
          <div className="mt-10 max-w-5xl mx-auto bg-white dark:bg-brand-dark-surface p-4 sm:p-6 rounded-brand-xl shadow-elevated dark:shadow-elevated-dark border border-brand-light-border dark:border-brand-dark-border">
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

      {/* 2. SECTION 4 PILIERS MÉTIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white">
            Un Écosystème Complet pour Bâtir en Toute Sérénité
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Chaque service est conçu pour éliminer les risques d’arnaques et sécuriser vos investissements en Côte d’Ivoire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                to={pillar.link}
                className="group p-6 rounded-brand-lg border bg-white dark:bg-brand-dark-surface border-brand-light-border dark:border-brand-dark-border shadow-card hover:shadow-elevated transition-smooth flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-brand flex items-center justify-center ${pillar.colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-brand-primary group-hover:translate-x-1 transition-transform">
                  <span>Accéder à l’espace</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

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

      {/* 4. BANNIÈRE D'ENGAGEMENT TRANSPARENCE & SÉCURITÉ - EFFET LIQUIDE GLASS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-brand-xl glass-water text-white p-8 sm:p-12 relative overflow-hidden">
          {/* Reflets liquides subtils en arrière-plan */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-secondary/30 blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold font-body leading-tight text-white drop-shadow-sm">
              Un Projet Foncier ou BTP en Côte d’Ivoire ?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow-sm">
              Consultez nos fiches d’orientation vers les plateformes ministérielles et vérifiez l’authenticité des actes fonciers avant tout engagement financier.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link to="/verification">
                <Button variant="primary" size="md" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                  Vérifier sur les Portails d’État
                </Button>
              </Link>
              <Link to="/calculateur">
                <Button variant="outline" size="md" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                  Estimer mes Frais Notariés
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
