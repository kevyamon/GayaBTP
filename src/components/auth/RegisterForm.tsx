import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Briefcase,
  Building2,
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/auth.service';
import { SocialAuthButtons } from './SocialAuthButtons';
import { RoleSelectorModal } from './RoleSelectorModal';
import { QUICK_ROLE_TYPES, QuickRoleType } from '../../types/roles';

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

  return (
    <div className="space-y-4">
      {/* 1. Sélecteur Rapide de Rôle (4 Cartes avec Icônes) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Je suis
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_ROLE_TYPES.map((type) => {
            const isSelected = selectedQuickType === type.id;
            const Icon =
              type.id === 'particulier'
                ? User
                : type.id === 'professionnel'
                  ? Briefcase
                  : type.id === 'entreprise'
                    ? Building2
                    : Compass;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleQuickTypeSelect(type.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-150 text-center cursor-pointer active:scale-95 ${isSelected
                    ? 'bg-brand-primary/15 border-brand-primary text-brand-primary shadow-sm ring-1 ring-brand-primary'
                    : 'bg-white/60 dark:bg-black/30 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-brand-primary' : 'text-slate-500'}`} />
                <span className="text-xs font-bold leading-tight">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Affichage de la spécialité précise pour les profils PRO / ENTREPRISE / GÉOMÈTRE */}
      {selectedQuickType !== 'particulier' && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-xs">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Spécialité BTP / Foncier :</span>
            <span className="font-bold text-slate-800 dark:text-white truncate block">{selectedRole}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsRoleModalOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Changer</span>
          </button>
        </div>
      )}

      {/* 3. Formulaire d'Informations */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <div className="relative">
            <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder={selectedQuickType === 'entreprise' ? "Nom de l'entreprise ou raison sociale" : "Nom complet"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              placeholder="Téléphone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ville (ex: Abidjan)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              placeholder="Mot de passe (min. 8 caractères)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-2.5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
          />
          <span>
            J’accepte les{' '}
            <span className="text-brand-primary underline">Conditions d’utilisation</span> et la{' '}
            <span className="text-brand-primary underline">Politique de confidentialité</span>.
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
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

      <SocialAuthButtons actionText="S’inscrire avec Google" separatorText="ou s’inscrire avec" />

      <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
        Déjà un compte ?{' '}
        <Link to={`/login${location.search}`} className="font-bold text-brand-primary hover:underline">
          Se connecter
        </Link>
      </div>

      <RoleSelectorModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        selectedRole={selectedRole}
        onSelectRole={(role) => setSelectedRole(role)}
      />
    </div>
  );
};
