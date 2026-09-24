import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { IVerificationItem } from '../../../services/admin.service';


interface AdminVerificationReviewModalProps {
  verification: IVerificationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (requestId: string, action: 'approve' | 'reject', notes?: string) => Promise<void>;
}

export const AdminVerificationReviewModal: React.FC<AdminVerificationReviewModalProps> = ({
  verification,
  isOpen,
  onClose,
  onReview,
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !verification) return null;

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsSubmitting(true);
    try {
      await onReview(verification._id, action, notes.trim() || undefined);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const pro = verification.proProfileId;
  const applicant = verification.userId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                Audit de Certification Pro
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {pro?.companyName || 'Entreprise BTP'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la modale */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Note de confidentialité & purge des pièces */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-900 dark:text-sky-300 text-xs">
            <Trash2 className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Politique de Confidentialité :</strong> Conformément aux normes de protection des données, les pièces justificatives sensibles sont automatiquement et définitivement supprimées du stockage après la prise de décision.
            </p>
          </div>

          {/* Informations demandeur & profil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Demandeur :</span>{' '}
              <strong className="text-slate-900 dark:text-white">{applicant?.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">E-mail :</span>{' '}
              <strong className="text-slate-900 dark:text-white">{applicant?.email}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Type de structure :</span>{' '}
              <strong className="text-slate-900 dark:text-white uppercase">{pro?.accountType || 'Entreprise'}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Spécialités :</span>{' '}
              <strong className="text-slate-900 dark:text-white">{pro?.specialties?.join(', ') || 'BTP'}</strong>
            </div>
          </div>

          {/* Liste des pièces justificatives téléversées */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Pièces justificatives fournies
            </p>
            <div className="space-y-2">
              {verification.idCardDocument?.url && (
                <a
                  href={verification.idCardDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-secondary" />
                    <span>Pièce d’identité officielle du gérant</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
              {verification.businessLicenseDocument?.url && (
                <a
                  href={verification.businessLicenseDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-secondary" />
                    <span>Registre de commerce (RCCM) / Agrément</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
              {verification.diplomaDocument?.url && (
                <a
                  href={verification.diplomaDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-xs text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-secondary" />
                    <span>Diplôme ou attestation technique BTP</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Motif / Commentaire d'audit */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Observations d’audit (transmises au professionnel en cas de rejet)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Pièces conformes et RCCM vérifié, ou document illisible..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 shadow-inner resize-none"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => handleAction('reject')}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4" />
            <span>Rejeter le dossier</span>
          </button>
          <button
            type="button"
            onClick={() => handleAction('approve')}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>Accorder le Badge Vérifié</span>
          </button>
        </div>
      </div>
    </div>
  );
};
