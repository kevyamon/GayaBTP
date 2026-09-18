import React from 'react';
import { Calculator, ArrowRight, FileCheck, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IListing } from '../../types';
import { Button } from '../ui/Button';

interface ListingLegalCardProps {
  listing: IListing;
}

export const ListingLegalCard: React.FC<ListingLegalCardProps> = ({ listing }) => {
  // Estimation indicative des frais fonciers en Côte d'Ivoire (~ 8.5 % du montant total : DGI 6% + Émoluments Notaire ~2.5%)
  const estimatedDgiFees = Math.round(listing.priceFCFA * 0.06);
  const estimatedNotaryFees = Math.round(listing.priceFCFA * 0.025);
  const totalEstimatedFees = estimatedDgiFees + estimatedNotaryFees;
  const pricePerM2 = listing.surfaceM2 > 0 ? Math.round(listing.priceFCFA / listing.surfaceM2) : 0;

  return (
    <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-brand-xl p-6 space-y-6 shadow-card">
      
      {/* 1. ÉTAT JURIDIQUE DU TITRE */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-brand-secondary shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Statut Foncier Certifié
          </h3>
        </div>

        <div className="p-4 rounded-brand border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Type d’acte juridique :
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              {listing.titleType === 'ACD'
                ? 'Arrêté de Concession Définitive (ACD)'
                : listing.titleType === 'CMP'
                ? 'Certificat de Mutation de Propriété (CMP)'
                : listing.titleType}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Prix unitaire au m² :
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {pricePerM2.toLocaleString('fr-FR')}&nbsp;FCFA / m²
            </span>
          </div>
        </div>
      </div>

      {/* 2. SIMULATION EXPRESS DES FRAIS D'ACQUISITION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-primary shrink-0" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Estimation des Frais d’Acquisition
            </h4>
          </div>
          <span className="text-[10px] text-slate-400">Barème officiel CI</span>
        </div>

        <div className="p-3.5 rounded-brand bg-slate-50 dark:bg-brand-dark border border-brand-light-border dark:border-brand-dark-border space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>Droits d’enregistrement DGI (~6%) :</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {estimatedDgiFees.toLocaleString('fr-FR')}&nbsp;FCFA
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span>Honoraires du Notaire instrumentant (~2.5%) :</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {estimatedNotaryFees.toLocaleString('fr-FR')}&nbsp;FCFA
            </span>
          </div>
          <div className="pt-2 border-t border-brand-light-border dark:border-brand-dark-border flex items-center justify-between font-bold">
            <span className="text-slate-900 dark:text-white">Budget total d’acte estimé :</span>
            <span className="text-brand-primary">
              {totalEstimatedFees.toLocaleString('fr-FR')}&nbsp;FCFA
            </span>
          </div>
        </div>

        <Link to="/verification">
          <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Vérifier sur les portails d’État
          </Button>
        </Link>
      </div>

      {/* 3. AVERTISSEMENT DE SÉCURITÉ GAYABTP */}
      <div className="flex items-start gap-3 p-3 rounded-brand bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-slate-700 dark:text-slate-300">
        <FileCheck className="w-4 h-4 text-brand-urgent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Exigez systématiquement la consultation du Livre Foncier DGI avant tout versement d’acompte. Toute transaction doit être passée devant notaire.
        </p>
      </div>

    </div>
  );
};
