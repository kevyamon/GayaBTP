import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { AdminLoginForm } from './AdminLoginForm';
import { AdminRegisterForm } from './AdminRegisterForm';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Verrouillage strict du défilement de l'arrière-plan lors de l'ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden p-5 sm:p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête sécurisé */}
        <div className="text-center pb-3 shrink-0">
          <div className="mx-auto w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-lg mb-2">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Portail Administrateur GayaBTP
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tour de contrôle nationale Foncier & BTP
          </p>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 mb-3.5 shrink-0">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Inscription Admin
          </button>
        </div>

        {/* Zone interne défilable contenant les formulaires */}
        <div className="flex-1 overflow-y-auto pr-1 pb-1 overscroll-contain">
          {tab === 'login' ? (
            <AdminLoginForm onSuccess={onSuccess} />
          ) : (
            <AdminRegisterForm onSuccess={onSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
