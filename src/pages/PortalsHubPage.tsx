import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, ArrowRight, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { portalService } from '../services/portal.service';
import { IPortal } from '../types';

export const PortalsHubPage: React.FC = () => {
  const [portals, setPortals] = useState<IPortal[]>([]);

  useEffect(() => {
    portalService.getPortals().then(setPortals);
  }, []);

  const securitySteps = [
    {
      num: '01',
      title: 'Vérification du Titre Foncier (ACD / CMP)',
      desc: 'Exigez la copie de l’Arrêté de Concession Définitive ou du Certificat de Mutation de Propriété et contrôlez son enregistrement au Livre Foncier DGI.',
    },
    {
      num: '02',
      title: 'Consultation Cadastrale & IDUFCI',
      desc: 'Assurez-vous que le terrain dispose d’un numéro IDUFCI actif et que le plan de situation est conforme à l’extrait topographique.',
    },
    {
      num: '03',
      title: 'Bornage Contradictoire par Géomètre Expert',
      desc: 'Faites réaliser un constat physique des limites par un géomètre assermenté inscrit au tableau de l’OGECI.',
    },
    {
      num: '04',
      title: 'Vérification de l’Approbation Ministérielle',
      desc: 'Pour les lotissements villageois, vérifiez l’existence d’un arrêté d’approbation valide délivré par le MCLU.',
    },
    {
      num: '05',
      title: 'Signature Obligatoire par Acte Notarié',
      desc: 'Toute transaction immobilière en Côte d’Ivoire doit obligatoirement être instrumentée par un Notaire sous peine de nullité absolue.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-36 sm:pb-40 lg:pb-16 space-y-12">
      
      {/* 1. EN-TÊTE INSTITUTIONNEL */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title text-slate-900 dark:text-white leading-tight">
          Hub Officiel des Portails Fonciers de Côte d’Ivoire
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Accédez directement aux registres publics certifiés pour vérifier la légitimité des parcelles, la validité des ACD et l’état des droits réels.
        </p>
      </div>

      {/* 2. AVERTISSEMENT DE TRANSPARENCE JURIDIQUE */}
      <div className="p-5 sm:p-6 rounded-brand-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200 shadow-sm flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-brand-urgent shrink-0 mt-1" />
        <div className="space-y-1 text-xs sm:text-sm">
          <h3 className="font-bold text-slate-900 dark:text-amber-300">
            Avertissement de Transparence & Déontologie GayaBTP
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            GayaBTP agit en tant que tiers technologique d’orientation et de facilitation. Notre plateforme ne se substitue aucunement aux prérogatives souveraines de l’État de Côte d’Ivoire, des Conservations Foncières, du Ministère de la Construction (MCLU) ou des offices notariaux assermentés.
          </p>
        </div>
      </div>

      {/* 3. GRILLE DES PORTAILS ÉTATIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className="flex flex-col justify-between p-6 rounded-brand-xl border bg-white dark:bg-brand-dark-surface border-brand-light-border dark:border-brand-dark-border shadow-card hover:shadow-elevated transition-smooth space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                  {portal.officialEntity}
                </span>
                <Badge variant={portal.isOfficialState ? 'verified' : 'secondary'} size="sm">
                  {portal.badgeText}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {portal.name}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {portal.description}
              </p>

              <div className="pt-2 space-y-1.5">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Démarches réalisables sur ce portail :
                </h4>
                <ul className="space-y-1">
                  {portal.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-brand text-xs font-bold bg-brand-secondary hover:bg-brand-secondary-hover text-white transition-colors shadow-sm"
            >
              <span>Accéder au service officiel</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      {/* 4. GUIDE DES 5 ÉTAPES INDISPENSABLES POUR SÉCURISER L'ACHAT */}
      <section className="p-8 sm:p-10 rounded-brand-xl border bg-slate-50 dark:bg-brand-dark-surface border-brand-light-border dark:border-brand-dark-border space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white">
            Protocole de Sécurité en 5 Étapes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            La méthodologie rigoureuse pour tout investissement foncier en Côte d’Ivoire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securitySteps.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-brand border bg-white dark:bg-brand-dark border-brand-light-border dark:border-brand-dark-border space-y-3 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-title text-sm flex items-center justify-center">
                {step.num}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}

          {/* Carte 6 : Accès simulateur */}
          <div className="p-5 rounded-brand border border-brand-primary/40 bg-brand-primary-light/40 dark:bg-brand-primary/10 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-2">
              <Calculator className="w-6 h-6 text-brand-primary" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Calculateur de Frais Foncier
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Estimez immédiatement les droits d’enregistrement DGI et honoraires notariés de votre projet.
              </p>
            </div>
            <Link to="/calculateur">
              <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Lancer une simulation
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
