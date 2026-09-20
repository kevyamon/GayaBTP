import React, { useState } from 'react';
import { Mail, KeyRound, Lock, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { authService } from '../../services/auth.service';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      error('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword({ email: cleanEmail });
      success(
        'Code de sécurité envoyé !',
        'Consultez votre boîte de réception pour récupérer votre code à 6 chiffres.'
      );
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’envoi.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      error('Le code de sécurité doit comporter exactement 6 chiffres.');
      return;
    }
    if (newPassword.length < 8) {
      error('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });
      setStep(3);
      success(
        'Mot de passe mis à jour !',
        'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Code invalide ou expiré.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        step === 3
          ? 'Mot de passe modifié'
          : step === 2
          ? 'Nouveau mot de passe'
          : 'Mot de passe oublié'
      }
      subtitle={
        step === 3
          ? 'Votre compte a été sécurisé avec succès'
          : step === 2
          ? `Saisissez le code reçu par e-mail à ${email}`
          : 'Un code de sécurité à 6 chiffres vous sera envoyé par e-mail'
      }
      maxWidth="md"
    >
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Adresse e-mail de votre compte
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Envoyer le code OTP
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Code de sécurité à 6 chiffres
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="Ex : 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-secondary/40 dark:border-brand-secondary/40 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-brand-secondary shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Nouveau mot de passe (min. 8 caractères)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary shadow-sm"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brand-secondary font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Renvoyer un code</span>
            </button>

            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Valider le mot de passe
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous
            connecter en toute sécurité.
          </p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              handleClose();
              if (onSuccess) onSuccess();
            }}
          >
            Se connecter maintenant
          </Button>
        </div>
      )}
    </Modal>
  );
};
