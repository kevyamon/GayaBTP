import React, { useState } from 'react';
import {
  Key,
  Copy,
  Check,
  ShieldAlert,
  Loader2,
  Mail,
  UserPlus,
  Clock,
} from 'lucide-react';
import { adminService, IAdminInvitation } from '../../../services/admin.service';
import { useToast } from '../../../contexts/ToastContext';

export const AdminTeamSection: React.FC = () => {
  const { success, error } = useToast();

  const [targetEmail, setTargetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastInvitation, setLastInvitation] = useState<IAdminInvitation | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasCopied(false);
    try {
      const inv = await adminService.createInvitation(
        targetEmail.trim() ? targetEmail.trim().toLowerCase() : undefined
      );
      setLastInvitation(inv);
      setTargetEmail('');
      success(
        'Code d’invitation généré',
        `Le code ${inv.code} est valide pendant 24 heures.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la génération du code.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!lastInvitation) return;
    navigator.clipboard.writeText(lastInvitation.code);
    setHasCopied(true);
    success('Code copié dans le presse-papier !');
    setTimeout(() => setHasCopied(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* En-tête */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Équipe & Invitations Sécurisées
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Génération de codes temporaires à usage unique pour créer des sous-administrateurs
        </p>
      </div>

      {/* Règle de sécurité Forteresse */}
      <div className="flex items-start gap-3 p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Principe du Moindre Privilège :</strong> La clé maître <code className="font-mono bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">AD_PW</code> ne doit jamais être partagée. Pour intégrer un nouveau collaborateur dans l’équipe de gestion, générez un code unique <code className="font-mono bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded">GY-AD-XXXXXX</code> valable 24h.
        </p>
      </div>

      {/* Formulaire de génération */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm max-w-xl space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-brand-secondary" />
          <span>Créer un code d’invitation sous-administrateur</span>
        </h3>

        <form onSubmit={handleGenerateCode} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Adresse e-mail du futur collaborateur (optionnelle mais recommandée)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="collaborateur@gayabtp.ci"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 shadow-inner"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Si renseignée, seul cet e-mail précis pourra consommer le code lors de son inscription.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 px-6 rounded-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Générer un code à usage unique</span>
              </>
            )}
          </button>
        </form>

        {/* Code généré avec bouton copier */}
        {lastInvitation && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 animate-in zoom-in-95 duration-200">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Code prêt à être transmis (Expire dans 24 heures) :
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-black/40 border border-emerald-500/30">
              <span className="font-mono text-base font-black tracking-widest text-slate-900 dark:text-white">
                {lastInvitation.code}
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            {lastInvitation.targetEmail && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Réservé exclusivement à : <strong>{lastInvitation.targetEmail}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
