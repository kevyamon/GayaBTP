import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/auth.service';
import { SocialAuthButtons } from './SocialAuthButtons';
import { RoleSelectorModal } from './RoleSelectorModal';
import { RoleQuickSelector } from './RoleQuickSelector';
import { QuickRoleType } from '../../types/roles';
import { triggerGoogleSignIn } from '../../services/googleAuth';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserSession } = useAuth();
  const { success, error } = useToast();

  const [selectedQuickType, setSelectedQuickType] = useState<QuickRoleType['id']>('particulier');
  const [selectedRole, setSelectedRole] = useState<string>('Propriétaire ou acheteur particulier');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Abidjan');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleQuickTypeSelect = (typeId: QuickRoleType['id']) => {
    setSelectedQuickType(typeId);
    if (typeId === 'particulier') {
      setSelectedRole('Propriétaire ou acheteur particulier');
    } else if (typeId === 'geometre') {
      setSelectedRole('Géomètre-expert');
    } else if (typeId === 'entreprise') {
      setSelectedRole('Entreprise générale de construction');
    } else {
      setSelectedRole('Ingénieur en génie civil');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (!acceptTerms) {
      error('Veuillez accepter les Conditions Générales d’Utilisation.');
      return;
    }

    setIsLoading(true);
    try {
      if (selectedQuickType === 'particulier') {
        const data = await authService.registerParticulier({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
        });
        setUserSession(data.user, data.tokens.accessToken);
      } else {
        const data = await authService.registerPro({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          accountType:
            selectedQuickType === 'entreprise'
              ? 'entreprise'
              : selectedQuickType === 'geometre'
                ? 'cabinet'
                : 'artisan',
          companyName: name.trim(),
          specialties: [selectedRole],
          city: city.trim(),
          phoneWhatsApp: phone.trim() || '+225 00000000',
        });
        setUserSession(data.user, data.tokens.accessToken, data.proProfile);
      }

      success('Bienvenue sur GayaBTP !', 'Votre compte a été créé avec succès.');
      navigate(redirectTo);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du compte.';
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
          'Inscription Google réussie !',
          `Bienvenue ${authData.user.name || ''} sur GayaBTP.`
        );
        setIsGoogleLoading(false);
        navigate(redirectTo);
      },
      (errMsg) => {
        error(errMsg);
        setIsGoogleLoading(false);
      }
    );
  };

  return (
    <div className="space-y-3.5">
      {/* 1. Sélecteur Rapide de Rôle Modulaire */}
      <RoleQuickSelector
        selectedQuickType={selectedQuickType}
        selectedRole={selectedRole}
        onSelectQuickType={handleQuickTypeSelect}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      {/* 2. Formulaire d'Informations */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Champ Nom */}
        <div className="relative">
          <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            required
            placeholder={
              selectedQuickType === 'entreprise'
                ? 'Nom de l’entreprise ou raison sociale'
                : 'Nom complet'
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
          />
        </div>

        {/* Champ E-mail */}
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
          />
        </div>

        {/* Champs Téléphone et Ville (pour les pros et particuliers) */}
        {selectedQuickType !== 'particulier' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in duration-200">
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                placeholder="Téléphone / WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
              />
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ville (ex: Abidjan)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Champ Mot de Passe */}
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-11 pr-11 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Conditions Générales d'Utilisation */}
        <label className="flex items-start gap-2 pt-0.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-tight">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-brand-secondary focus:ring-brand-secondary"
          />
          <span>
            J’accepte les{' '}
            <span className="text-brand-secondary font-semibold hover:underline">
              Conditions d’utilisation
            </span>{' '}
            et la{' '}
            <span className="text-brand-secondary font-semibold hover:underline">
              Politique de confidentialité
            </span>
            .
          </span>
        </label>

        {/* Bouton Créer mon compte (Pill Noir Arrondi) */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full mt-1.5 py-3.5 px-6 rounded-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-slate-950" />
              <span>Création du compte...</span>
            </>
          ) : (
            <>
              <span>Créer mon compte</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Authentification Google */}
      <SocialAuthButtons
        actionText="Continuer avec Google"
        separatorText="ou s’inscrire avec"
        onGoogleClick={handleGoogleAuth}
        isLoading={isGoogleLoading}
      />

      {/* Lien vers Connexion */}
      <div className="pt-0.5 text-center text-xs text-slate-600 dark:text-slate-400">
        Déjà un compte ?{' '}
        <Link
          to={`/login${location.search}`}
          className="font-bold text-brand-secondary hover:text-brand-secondary-hover dark:text-sky-300 hover:underline"
        >
          Se connecter
        </Link>
      </div>

      {/* Modale de Sélection des Spécialités BTP */}
      <RoleSelectorModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        selectedRole={selectedRole}
        onSelectRole={(role) => setSelectedRole(role)}
      />
    </div>
  );
};
