import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OrangeHoneycombGrid } from '../common/OrangeHoneycombGrid';

/**
 * Icône sur mesure 1 : Titre & Parcelle Cadastrale avec Bornage Certifié
 */
const CadastralParcelIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
    <polygon points="3,7 13,3 21,9 17,21 5,18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="3" cy="7" r="1.3" fill="currentColor" />
    <circle cx="13" cy="3" r="1.3" fill="currentColor" />
    <circle cx="21" cy="9" r="1.3" fill="currentColor" />
    <circle cx="17" cy="21" r="1.3" fill="currentColor" />
    <circle cx="5" cy="18" r="1.3" fill="currentColor" />
    <path d="M9.5 12l2 2 3.5-3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Icône sur mesure 2 : Registre d'État & Portail Ministériel Officiel
 */
const StateRegistryIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
    <path d="M3 9l9-5 9 5v2H3V9z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="6" y1="11" x2="6" y2="18" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="10" y1="11" x2="10" y2="18" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="14" y1="11" x2="14" y2="18" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="18" y1="11" x2="18" y2="18" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 18h20v3H2v-3z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
  </svg>
);

/**
 * Icône sur mesure 3 : Bureau d'Architecture & Génie Civil Labellisé
 */
const ArchitectureBureauIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
    <circle cx="12" cy="4" r="2" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11 6L5 20" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 6l6 14" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 14h8" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="10" y1="12.5" x2="10" y2="15.5" strokeWidth="1.5" />
    <line x1="14" y1="12.5" x2="14" y2="15.5" strokeWidth="1.5" />
  </svg>
);

/**
 * Icône sur mesure 4 : Balance Notariée & Droits d'Enregistrement Fiscaux
 */
const NotaryFiscalIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
    <line x1="12" y1="3" x2="12" y2="20" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 7h16" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 7l-2 5c0 1.5 1.8 2.5 3.5 2.5s3.5-1 3.5-2.5L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 7l-1.5 5c0 1.5 1.8 2.5 3.5 2.5s3.5-1 3.5-2.5L20 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 21h6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      title: 'Terrains Sécurisés (ACD & CMP)',
      description: 'Acquérez des parcelles auditées avec titres inattaquables et bornage certifié.',
      icon: CadastralParcelIcon,
      link: '/annonces?titleType=ACD',
      colorClass: 'text-brand-secondary bg-brand-secondary-light dark:bg-brand-secondary/20',
    },
    {
      title: 'Hub de Vérification Étatique',
      description: 'Accédez aux registres officiels de l’État : IDUFCI, DGI Livre Foncier et MCLU.',
      icon: StateRegistryIcon,
      link: '/verification',
      colorClass: 'text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20',
    },
    {
      title: 'Artisans & Bureaux BTP Labellisés',
      description: 'Consultez des maçons, architectes et géomètres au Badge Professionnel Vérifié.',
      icon: ArchitectureBureauIcon,
      link: '/pros',
      colorClass: 'text-brand-accent-hover bg-brand-accent-light dark:bg-brand-accent/20',
    },
    {
      title: 'Simulateur de Frais Notariés & DGI',
      description: 'Calculez au centime près les frais d’acquisition et droits d’enregistrement.',
      icon: NotaryFiscalIcon,
      link: '/calculateur',
      colorClass: 'text-brand-urgent bg-amber-100 dark:bg-amber-950/30',
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-brand-dark-surface border-t border-b border-brand-light-border dark:border-brand-dark-border shadow-sm -mt-6 sm:-mt-10">
      
      {/* EN-TÊTE IMMERSIF EN ARC PLEINE LARGEUR OPTIMISÉ POUR UN DÉFILEMENT 60FPS */}
      <div className="relative w-full overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-8 text-center bg-gradient-to-b from-brand-primary/10 via-transparent to-transparent">
        
        {/* 1. Animation en fond vectoriel léger */}
        <OrangeHoneycombGrid />

        {/* 2. Voile translucide ultra-léger sans filtre de flou lourd */}
        <div className="absolute inset-0 bg-white/40 dark:bg-brand-dark/40 pointer-events-none" />

        {/* 3. Découpe en Arc inférieur incurvé pleine largeur avec liseré orange lumineux */}
        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-16 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 Q720,80 1440,0 L1440,90 L0,90 Z"
              className="fill-white dark:fill-brand-dark-surface"
            />
            <path
              d="M0,0 Q720,80 1440,0"
              fill="none"
              stroke="#E99021"
              strokeOpacity="0.45"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* 4. Contenu Textuel au premier plan */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-3 pb-4 sm:pb-6 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-title text-slate-900 dark:text-white leading-tight drop-shadow-md">
            Un Écosystème Complet pour Bâtir en Toute Sérénité
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-200 font-semibold leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Chaque service est conçu pour éliminer les risques d’arnaques et sécuriser vos investissements en Côte d’Ivoire.
          </p>
        </div>

      </div>

      {/* GRILLE CENTRÉE DES 4 PILIERS MÉTIERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                to={pillar.link}
                className="group p-6 rounded-brand-lg border bg-slate-50/80 dark:bg-brand-dark border-brand-light-border dark:border-brand-dark-border shadow-sm hover:shadow-card hover:border-brand-primary/40 transition-smooth flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-brand flex items-center justify-center ${pillar.colorClass} transition-transform group-hover:scale-105`}>
                    <Icon />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center text-xs font-semibold text-brand-primary group-hover:translate-x-1 transition-transform">
                  <span>Accéder à l’espace</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </section>
  );
};

