import React from 'react';
import { Upload, Trash2, Phone, MessageCircle, User, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PhotosContactData {
  photos: string[];
  contactName: string;
  phoneCall: string;
  phoneWhatsApp: string;
}

interface StepProps {
  data: PhotosContactData;
  onChange: (data: PhotosContactData) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const StepPhotosContact: React.FC<StepProps> = ({
  data,
  onChange,
  onSubmit,
  onPrev,
  isLoading,
}) => {

  const handleAddSamplePhoto = (url: string) => {
    if (!data.photos.includes(url)) {
      onChange({ ...data, photos: [...data.photos, url] });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const updated = data.photos.filter((_, i) => i !== index);
    onChange({ ...data, photos: updated });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simule un upload d'image locale en créant des URLs blob
      const newUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      onChange({ ...data, photos: [...data.photos, ...newUrls] });
    }
  };

  const handleCopyPhoneToWhatsApp = () => {
    if (data.phoneCall && !data.phoneWhatsApp) {
      onChange({ ...data, phoneWhatsApp: data.phoneCall });
    }
  };

  const isComplete =
    data.photos.length > 0 &&
    data.contactName.trim().length >= 3 &&
    data.phoneCall.trim().length >= 8;

  return (
    <div className="space-y-6">
      {/* 1. Galerie de photos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Photos du bien ou de la parcelle (Min. 1 photo) *
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {data.photos.length} photo{data.photos.length > 1 ? 's' : ''} ajoutée{data.photos.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Grille des vignettes photos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.photos.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video sm:aspect-square rounded-brand overflow-hidden group border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <img src={url} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-primary text-white shadow-sm">
                  Photo Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 text-white hover:bg-brand-urgent transition-colors cursor-pointer"
                title="Supprimer la photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Bouton d'ajout de photo */}
          <label className="aspect-video sm:aspect-square rounded-brand border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-primary/60 flex flex-col items-center justify-center gap-1.5 p-3 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-[11px] font-bold text-brand-primary">Ajouter une photo</span>
            <span className="text-[9px] text-slate-400">JPG, PNG (max 8 Mo)</span>
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Suggestion d'images types pour test rapide si la liste est vide */}
        {data.photos.length === 0 && (
          <div className="pt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
              Suggestions d’images d’illustration pour votre annonce :
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Terrain Borné Bingerville', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800' },
                { label: 'Villa Moderne Cocody', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800' },
                { label: 'Lotissement Viabilisé', url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800' },
              ].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => handleAddSamplePhoto(sample.url)}
                  className="px-2.5 py-1 rounded-brand text-[11px] font-semibold bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 border border-brand-primary/30 transition-colors cursor-pointer"
                >
                  + {sample.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Coordonnées de contact direct */}
      <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Coordonnées de l’interlocuteur
        </h4>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <User className="w-3.5 h-3.5 text-brand-primary" />
            <span>Nom &amp; Prénoms du propriétaire / représentant *</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex : M. Kouamé Yao Aristide"
            value={data.contactName}
            onChange={(e) => onChange({ ...data, contactName: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Phone className="w-3.5 h-3.5 text-brand-secondary" />
              <span>Téléphone pour appels directs *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Ex : +225 07 08 09 10 11"
              value={data.phoneCall}
              onChange={(e) => onChange({ ...data, phoneCall: e.target.value })}
              onBlur={handleCopyPhoneToWhatsApp}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Numéro WhatsApp direct</span>
            </label>
            <input
              type="tel"
              placeholder="Ex : +225 07 08 09 10 11"
              value={data.phoneWhatsApp}
              onChange={(e) => onChange({ ...data, phoneWhatsApp: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-brand border border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Boutons de finalisation */}
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
          disabled={!isComplete || isLoading}
          isLoading={isLoading}
          onClick={onSubmit}
          rightIcon={<Send className="w-4 h-4" />}
          className="text-xs sm:text-sm px-3.5 sm:px-5"
        >
          <span className="hidden sm:inline">Valider et </span>
          <span>Publier l’annonce</span>
        </Button>
      </div>
    </div>
  );
};
