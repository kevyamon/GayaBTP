import React, { useState, useEffect } from 'react';
import { Shield, LogOut, RefreshCw, Radio, User } from 'lucide-react';
import { useAdminAuth } from '../../../contexts/AdminAuthContext';
import { ThemeToggle } from '../../common/ThemeToggle';
import { clientSocketService } from '../../../services/socket.service';

interface AdminHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onRefresh, isRefreshing = false }) => {
  const { adminUser, logoutAdmin } = useAdminAuth();
  const [time, setTime] = useState<string>('');
  const isSocketConnected = clientSocketService.getIsConnected();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Indicateur Temps Réel */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                GayaBTP Admin
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Radio className={`w-2.5 h-2.5 ${isSocketConnected ? 'animate-pulse text-emerald-500' : 'text-slate-400'}`} />
                <span>{isSocketConnected ? 'En direct' : 'Connecté'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{time}</p>
          </div>
        </div>

        {/* Actions & Profil Administrateur */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bouton d'actualisation manuelle */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="Actualiser les données"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-secondary' : ''}`} />
          </button>

          {/* Bascule Thème Sombre/Clair */}
          <ThemeToggle />

          {/* Badge & Identité Admin */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {adminUser?.name || 'Administrateur'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                {adminUser?.email}
              </p>
            </div>
          </div>

          {/* Bouton de Déconnexion */}
          <button
            type="button"
            onClick={logoutAdmin}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer ml-1"
            title="Se déconnecter du tableau de bord"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
