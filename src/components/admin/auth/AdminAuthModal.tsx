import React, { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête sécurisé */}
        <div className="text-center pb-5">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-lg mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Portail Administrateur GayaBTP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tour de contrôle nationale Foncier & BTP
          </p>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 mb-5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
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
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Inscription Admin
          </button>
        </div>

        {/* Formulaire Actif */}
        {tab === 'login' ? (
          <AdminLoginForm onSuccess={onSuccess} />
        ) : (
          <AdminRegisterForm onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
};
