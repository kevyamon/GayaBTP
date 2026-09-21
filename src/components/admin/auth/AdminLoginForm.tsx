import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { useToast } from '../../../contexts/ToastContext';

interface AdminLoginFormProps {
  onSuccess: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const { loginAdmin, isLoading } = useAdminAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      error('Veuillez renseigner votre adresse e-mail et votre mot de passe d’administration.');
      return;
    }

    try {
      await loginAdmin({ email: cleanEmail, password });
      success(
        'Authentification réussie',
        'Bienvenue dans la tour de contrôle administrative GayaBTP.'
      );
      onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Identifiants administrateur incorrects ou accès refusé.';
      error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alerte discrète de sécurité */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
        <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="leading-tight">
          Accès restreint aux administrateurs habilités. Toutes les tentatives sont consignées.
        </span>
      </div>

      {/* Champ E-mail Administrateur */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Adresse e-mail administrateur
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="admin@gayabtp.ci"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
          />
        </div>
      </div>

      {/* Champ Mot de Passe Administrateur */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Mot de passe sécurisé
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label={showPassword ? 'Masquer' : 'Afficher'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bouton de Connexion Admin */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-5 rounded-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Vérification des droits...</span>
          </>
        ) : (
          <>
            <span>Déverrouiller le panneau</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
