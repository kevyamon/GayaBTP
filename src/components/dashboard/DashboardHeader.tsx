import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Clock,
  LogOut,
  Building,
  Sparkles,
  MapPin,
  Calendar,
  Edit3,
  Mail,
  Phone,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80';

export const DashboardHeader: React.FC = () => {
  const { user, proProfile, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    success('Déconnexion réussie', 'À très bientôt sur la plateforme GayaBTP.');
    navigate('/');
  };

  const isPro = user?.role === 'professionnel';
  const isVerified = proProfile?.verificationStatus === 'approved' || proProfile?.isVerified;
  const coverUrl = user?.coverImage || proProfile?.coverImage || proProfile?.coverUrl || DEFAULT_COVER;
  const avatarUrl = user?.avatar || proProfile?.avatarUrl;
  const city = user?.city || proProfile?.city || 'Abidjan';
  const bio = user?.bio || proProfile?.bio;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : '2026';

  return (
    <>
      <div className="bg-white dark:bg-brand-dark-surface rounded-2xl sm:rounded-3xl border border-brand-light-border dark:border-brand-dark-border shadow-soft overflow-hidden">
        
        {/* 1. Photo de Couverture / Bannière Immersive */}
        <div className="relative h-36 sm:h-52 w-full bg-slate-900 overflow-hidden">
          <img
            src={coverUrl}
            alt="Couverture du profil"
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Bouton d'édition rapide sur la bannière */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier la couverture</span>
          </button>
        </div>

        {/* 2. Section Informations Utilisateur */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-0 relative">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            {/* Avatar Superposé */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-brand-primary to-brand-primary-light flex items-center justify-center text-white text-2xl sm:text-3xl font-bold ring-4 ring-white dark:ring-brand-dark-surface shadow-lg overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-10 h-10" />
                )}
              </div>
            </div>

            {/* Actions Droite (Modifier profil, Mot de passe & Déconnexion) */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-brand-primary" />
                <span>Modifier mon profil</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <KeyRound className="w-4 h-4 text-brand-primary" />
                <span>Sécurité & Mot de passe</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>

          {/* Coordonnées & Présentation Complète */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {user?.name || 'Utilisateur GayaBTP'}
              </h1>

              {/* Badge Rôle */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-sky-300">
                {isPro ? (
                  <>
                    <Building className="w-3.5 h-3.5" />
                    <span>Professionnel BTP</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>Particulier</span>
                  </>
                )}
              </span>

              {/* Badge Vérifié (Pro uniquement) */}
              {isPro && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isVerified
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Certifié Conforme</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Vérification en cours</span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Fiche Contact & Localisation */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user?.email}</span>
              </span>

              {user?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{user.phone}</span>
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{city}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Membre depuis {memberSince}</span>
              </span>
            </div>

            {/* Fiche Entreprise (Si Pro) */}
            {isPro && proProfile?.companyName && (
              <p className="text-xs sm:text-sm font-semibold text-brand-primary dark:text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Entreprise : {proProfile.companyName}</span>
                {proProfile.yearsOfExperience ? ` • ${proProfile.yearsOfExperience} ans d'expérience` : ''}
              </p>
            )}

            {/* Bio / Présentation */}
            {bio ? (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1 leading-relaxed bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                {bio}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic pt-1">
                Aucune description renseignée. Cliquez sur "Modifier mon profil" pour ajouter une présentation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modale d'Édition du Profil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Modale de Modification du Mot de Passe */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};
