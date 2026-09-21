import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { isAdminAuthenticated } = useAdminAuth();

  // Si l'utilisateur n'est pas un administrateur connecté, affichage strict d'une page 404
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-brand-light dark:bg-brand-dark">
        <div className="w-16 h-16 rounded-3xl bg-slate-200/70 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          404
        </h1>
        <p className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300 mt-2">
          Page introuvable
        </p>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
          La ressource demandée n’existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l’accueil</span>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
