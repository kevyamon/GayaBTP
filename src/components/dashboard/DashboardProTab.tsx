import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, Building, Award, Upload, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardProTab: React.FC = () => {
  const { user, proProfile } = useAuth();
  const isVerified = proProfile?.verificationStatus === 'approved';

  return (
    <div className="space-y-6">
      {/* 1. Carte Badge Vérifié & Conformité Foncier / BTP */}
      <div className="p-6 rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl shrink-0 ${isVerified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Badge Vérifié GayaBTP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Garantie d’authenticité juridique et technique pour rassurer vos clients.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isVerified
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
            }`}
          >
            {isVerified ? 'Profil Certifié Conforme' : 'Dossier en attente de validation'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <p className="font-semibold text-slate-900 dark:text-white">
            Documents requis pour la vérification officielle :
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
            <li>Pièce d’identité officielle du gérant (CNI, Passeport ou Titre de séjour)</li>
            <li>Registre de Commerce (RCCM) ou Déclaration Fiscale d’Existence (DFE)</li>
            <li>Attestation d’inscription à l’Ordre (Architectes, Géomètres) ou Diplôme BTP</li>
          </ul>
        </div>

        {!isVerified && (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs sm:text-sm font-semibold hover:bg-brand-primary-light transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Transmettre mes justificatifs</span>
          </button>
        )}
      </div>

      {/* 2. Coordonnées & Spécialités Entreprise */}
      <div className="p-6 rounded-2xl bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-brand-primary" />
          <span>Fiche Entreprise & Compétences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Raison Sociale</span>
            <p className="font-bold text-slate-800 dark:text-slate-100">{proProfile?.companyName || user?.name}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Catégorie Métier</span>
            <p className="font-bold text-slate-800 dark:text-slate-100">{proProfile?.category || 'BTP Général'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Localisation</span>
            <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{proProfile?.city || 'Abidjan'} {proProfile?.district && `(${proProfile.district})`}</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Contact WhatsApp Pro</span>
            <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{proProfile?.phoneWhatsApp || user?.phone || 'Non renseigné'}</span>
            </p>
          </div>
        </div>

        {/* Spécialités */}
        {proProfile?.specialties && proProfile.specialties.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Spécialités déclarées :
            </span>
            <div className="flex flex-wrap gap-2">
              {proProfile.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-sky-300"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
