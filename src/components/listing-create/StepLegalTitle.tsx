import React, { useState } from 'react';
import { ShieldCheck, Upload, FileCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { LandTitleType } from '../../types';
import { LAND_TITLE_TYPES } from '../../theme/theme';
import { CustomSelect, SelectOption } from '../ui/CustomSelect';
import { Button } from '../ui/Button';

export interface LegalTitleData {
  titleType: LandTitleType | 'approbation' | 'bail_emphytéotique';
  titleNumber: string;
  lotNumber?: string;
  ilotNumber?: string;
  hasDocumentUploaded: boolean;
  documentFileName?: string;
}

interface StepProps {
  data: LegalTitleData;
  onChange: (data: LegalTitleData) => void;
  onNext: () => void;
  onPrev: () => void;
}

const TITLE_OPTIONS: SelectOption[] = LAND_TITLE_TYPES.map((t) => ({
  value: t.value,
  label: `${t.value.toUpperCase()} — ${t.label}`,
  description: t.description,
  badge: t.value.toUpperCase(),
}));

export const StepLegalTitle: React.FC<StepProps> = ({ data, onChange, onNext, onPrev }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({
        ...data,
        hasDocumentUploaded: true,
        documentFileName: file.name,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange({
        ...data,
        hasDocumentUploaded: true,
        documentFileName: file.name,
      });
    }
  };

  const isComplete = data.titleType && data.titleNumber.trim().length > 2;

  return (
    <div className="space-y-6">
      {/* 1. Sélection du Titre Foncier */}
      <CustomSelect
        label="Type de Titre Juridique Détenu"
        required
        value={data.titleType}
        onChange={(val) => onChange({ ...data, titleType: val })}
        options={TITLE_OPTIONS}
        modalTitle="Titre Juridique Détenu"
        modalSubtitle="Sélectionnez l’acte officiel attestant de vos droits de propriété"
      />

      {/* 2. Références administratives du titre */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1 space-y-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            N° de Titre / Arrêté *
          </label>
          <input
            type="text"
            required
            placeholder="Ex : N° 2023-0894/MCLU"
            value={data.titleNumber}
            onChange={(e) => onChange({ ...data, titleNumber: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            N° de Lot (si applicable)
          </label>
          <input
            type="text"
            placeholder="Ex : Lot 45"
            value={data.lotNumber || ''}
            onChange={(e) => onChange({ ...data, lotNumber: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            N° d’Îlot (si applicable)
          </label>
          <input
            type="text"
            placeholder="Ex : Îlot 12"
            value={data.ilotNumber || ''}
            onChange={(e) => onChange({ ...data, ilotNumber: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* 3. Téléversement du document justificatif */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Justificatif ou copie de l’acte (PDF, JPG, PNG)
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-brand-lg p-5 text-center transition-all ${
            dragActive
              ? 'border-brand-primary bg-brand-primary/5'
              : data.hasDocumentUploaded
              ? 'border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-brand-primary/60 bg-slate-50/50 dark:bg-slate-900/30'
          }`}
        >
          {data.hasDocumentUploaded ? (
            <div className="flex flex-col items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="w-8 h-8" />
              <div className="text-xs font-bold">{data.documentFileName || 'Document prêt pour vérification'}</div>
              <label className="text-[11px] underline text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
                Remplacer le document
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Glissez votre document ici ou{' '}
                <label className="text-brand-primary font-bold hover:underline cursor-pointer">
                  parcourez vos fichiers
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Taille maximale : 10 Mo. Document sécurisé et confidentiel.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Encadré d'information */}
      <div className="p-3.5 rounded-brand bg-brand-secondary/10 border border-brand-secondary/20 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
        <ShieldCheck className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Gage de transparence :</strong> Les annonces munies d’un titre authentique validé bénéficient du badge &laquo;&nbsp;Certifié GayaBTP&nbsp;&raquo; et d’une visibilité prioritaire.
        </p>
      </div>

      {/* Boutons de navigation */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onPrev}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0 text-xs sm:text-sm px-3 sm:px-4"
        >
          Retour
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!isComplete}
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="text-xs sm:text-sm px-3.5 sm:px-5"
        >
          <span className="hidden sm:inline">Étape suivante : </span>
          <span>Détails &amp; Prix</span>
        </Button>
      </div>
    </div>
  );
};
