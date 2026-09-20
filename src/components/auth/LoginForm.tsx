import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { SocialAuthButtons } from './SocialAuthButtons';

interface LoginFormProps {
  onForgotPasswordClick: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPasswordClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Récupération de l'URL de redirection éventuelle (ex: /publier)
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      error('Veuillez renseigner votre adresse e-mail et votre mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      await login(cleanEmail, password);
      success('Connexion réussie !', 'Bienvenue sur votre espace sécurisé GayaBTP.');
      navigate(redirectTo);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Identifiants incorrects ou problème de connexion.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Intégration Google OAuth
    success(
      'Connexion Google',
      'Authentification avec votre compte Google en cours de traitement.'
    );
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Adresse E-mail */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Adresse e-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
          </div>
        </div>

        {/* Champ Mot de Passe */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Mot de passe
            </label>
            <button
              type="button"
              onClick={() => onForgotPasswordClick(email)}
              className="text-[11px] font-bold text-brand-primary hover:underline cursor-pointer"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              aria-label={showPassword ? 'Masquer' : 'Afficher'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bouton Principal de Connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <>
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Authentification Sociale Google */}
      <SocialAuthButtons
        actionText="Continuer avec Google"
        separatorText="ou continuer avec"
        onGoogleClick={handleGoogleAuth}
      />

      {/* Lien vers Inscription */}
      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        Vous n’avez pas de compte ?{' '}
        <Link
          to={`/register${location.search}`}
          className="font-bold text-brand-primary hover:underline"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
};
