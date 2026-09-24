import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Ban,
  Calendar,
} from 'lucide-react';
import { IUser } from '../../../types';


interface AdminUserDetailsModalProps {
  user: IUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (userId: string, status: string, reason?: string) => Promise<void>;
  onUpdateRole: (userId: string, role: string, reason?: string) => Promise<void>;
  onBanUser: (userId: string, reason?: string) => Promise<void>;
}

export const AdminUserDetailsModal: React.FC<AdminUserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateRole,
  onBanUser,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [banReason, setBanReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const currentStatus = selectedStatus || user.status || 'active';
  const currentRole = selectedRole || user.role || 'particulier';

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === user.status) return;
    setIsSubmitting(true);
    try {
      await onUpdateStatus(user._id, selectedStatus);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedRole || selectedRole === user.role) return;
    setIsSubmitting(true);
    try {
      await onUpdateRole(user._id, selectedRole);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBan = async () => {
    if (!banReason.trim()) return;
    setIsSubmitting(true);
    try {
      await onBanUser(user._id, banReason.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Date inconnue';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-100/60 dark:bg-white/5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{user.phone || 'Non renseigné'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Inscrit le {formattedDate}</span>
            </div>
          </div>

          {/* Modification de Statut */}
          <div className="space-y-2 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <label className="block font-bold text-slate-900 dark:text-white">
              Statut du compte utilisateur
            </label>
            <div className="flex items-center gap-2">
              <select
                value={currentStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-secondary/50"
              >
                <option value="active">Actif (Accès normal)</option>
                <option value="suspended">Suspendu (Temporairement bloqué)</option>
                <option value="inactive">Inactif</option>
              </select>
              <button
                type="button"
                onClick={handleStatusChange}
                disabled={isSubmitting || !selectedStatus || selectedStatus === user.status}
                className="px-3.5 py-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                Mettre à jour
              </button>
            </div>
          </div>

          {/* Modification de Rôle */}
          <div className="space-y-2 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <label className="block font-bold text-slate-900 dark:text-white">
              Rôle attribué dans le système
            </label>
            <div className="flex items-center gap-2">
              <select
                value={currentRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-secondary/50"
              >
                <option value="particulier">Particulier / Acheteur</option>
                <option value="professionnel">Professionnel BTP</option>
                <option value="admin">Administrateur</option>
              </select>
              <button
                type="button"
                onClick={handleRoleChange}
                disabled={isSubmitting || !selectedRole || selectedRole === user.role}
                className="px-3.5 py-2 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer"
              >
                Changer le rôle
              </button>
            </div>
          </div>

          {/* Sanction : Bannissement définitif */}
          <div className="space-y-2 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <p className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Ban className="w-4 h-4" />
              Bannissement définitif du compte
            </p>
            <input
              type="text"
              placeholder="Motif du bannissement (obligatoire)..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <button
              type="button"
              onClick={handleBan}
              disabled={isSubmitting || !banReason.trim()}
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all disabled:opacity-40 cursor-pointer"
            >
              Appliquer le bannissement immédiat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
