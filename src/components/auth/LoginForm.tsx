import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { SocialAuthButtons } from './SocialAuthButtons';
import { triggerGoogleSignIn } from '../../services/googleAuth';

interface LoginFormProps {
  onForgotPasswordClick: (email: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPasswordClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setUserSession } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
    setIsGoogleLoading(true);
    triggerGoogleSignIn(
      (authData) => {
        setUserSession(authData.user, authData.tokens.accessToken, authData.proProfile);
        success(
          'Connexion Google réussie !',
          `Bienvenue ${authData.user.name || ''} sur GayaBTP.`
        );
        setIsGoogleLoading(false);
        navigate(redirectTo);
      },
      (errMsg) => {
        error(errMsg);
        setIsGoogleLoading(false);
      },
      () => {
        setIsGoogleLoading(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Champ Adresse E-mail */}
        <div className="space-y-1">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
            />
          </div>
        </div>

        {/* Champ Mot de Passe */}
        <div className="space-y-1">
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Lien Mot de passe oublié à droite */}
          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => onForgotPasswordClick(email)}
              className="text-[11px] font-bold text-brand-secondary hover:text-brand-secondary-hover dark:text-sky-300 hover:underline cursor-pointer"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        {/* Bouton Principal de Connexion (Pill Noir Arrondi) */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-950" />
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
        isLoading={isGoogleLoading}
      />

      {/* Lien vers Inscription */}
      <div className="pt-1 text-center text-xs text-slate-600 dark:text-slate-400">
        Vous n’avez pas de compte ?{' '}
        <Link
          to={`/register${location.search}`}
          className="font-bold text-brand-secondary hover:text-brand-secondary-hover dark:text-sky-300 hover:underline"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
};
