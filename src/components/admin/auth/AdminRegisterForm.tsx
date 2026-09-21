import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Key, Phone, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { adminService } from '../../../services/admin.service';

interface AdminRegisterFormProps {
  onSuccess: () => void;
}

export const AdminRegisterForm: React.FC<AdminRegisterFormProps> = ({ onSuccess }) => {
  const { registerAdmin, isLoading } = useAdminAuth();
  const { success, error } = useToast();

  const [superAdminExists, setSuperAdminExists] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    let isMounted = true;
    adminService
      .checkSetupStatus()
      .then((data) => {
        if (isMounted) {
          setSuperAdminExists(data.superAdminExists);
          setIsCheckingStatus(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSuperAdminExists(true);
          setIsCheckingStatus(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSecret = secretKey.trim();

    if (!name.trim() || !cleanEmail || !password || !cleanSecret) {
      error('Tous les champs obligatoires doivent être renseignés.');
      return;
    }

    try {
      if (!superAdminExists) {
        // Enregistrement initial du SuperAdmin via la Clé Maître AD_PW
        await registerAdmin({
          name: name.trim(),
          email: cleanEmail,
          password,
          phone: phone.trim() || undefined,
          masterKey: cleanSecret,
        });
        success(
          'Super Administrateur initialisé',
          'Votre compte SuperAdmin a été créé avec succès.'
        );
      } else {
        // Enregistrement d'un sous-administrateur via le code temporaire GY-AD-XXXXXX
        await registerAdmin({
          name: name.trim(),
          email: cleanEmail,
          password,
          phone: phone.trim() || undefined,
          temporaryCode: cleanSecret.toUpperCase(),
        });
        success(
          'Compte Administrateur activé',
          'Votre accès a été validé grâce au code d’invitation.'
        );
      }
      onSuccess();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Échec de la création du compte administrateur.';
      error(msg);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
        <span className="text-xs">Vérification de l’état du système...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* Bannière de mode d'inscription */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-900 dark:text-sky-300 text-xs">
        <KeyRound className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
        <span className="leading-tight">
          {!superAdminExists
            ? 'Initialisation de la plateforme : Création du compte SuperAdmin principal.'
            : 'Création d’un compte sous-administrateur via code d’invitation GY-AD-XXXXXX.'}
        </span>
      </div>

      {/* Champ Nom complet */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Nom et prénoms
        </label>
        <div className="relative">
          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            required
            placeholder="Koffi Armand"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
          />
        </div>
      </div>

      {/* Champ E-mail Administrateur */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Adresse e-mail professionnelle
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            required
            placeholder="admin@gayabtp.ci"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
          />
        </div>
      </div>

      {/* Champ Téléphone */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Numéro de téléphone
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="tel"
            placeholder="+225 0700000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
          />
        </div>
      </div>

      {/* Champ Clé Maître ou Code Invitation */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {!superAdminExists ? 'Clé Maître Secrète (AD_PW)' : 'Code d’invitation (GY-AD-XXXXXX)'}
        </label>
        <div className="relative">
          <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            placeholder={!superAdminExists ? 'Clé maître serveur' : 'GY-AD-XXXXXX'}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
          />
        </div>
      </div>

      {/* Champ Mot de Passe */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Mot de passe administrateur (min. 8 caractères)
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            minLength={8}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary shadow-inner"
          />
        </div>
      </div>

      {/* Bouton Création */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-5 rounded-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Création en cours...</span>
          </>
        ) : (
          <>
            <span>Créer le compte administrateur</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};
