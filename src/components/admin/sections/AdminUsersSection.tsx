import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { IUser, IPagination } from '../../../types';
import { AdminUserDetailsModal } from './AdminUserDetailsModal';
import { useToast } from '../../../contexts/ToastContext';

export const AdminUsersSection: React.FC = () => {
  const { success, error } = useToast();

  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers(
        page,
        15,
        searchQuery || undefined,
        roleFilter || undefined,
        statusFilter || undefined
      );
      setUsers(data.users);
      if (data.pagination) setPagination(data.pagination);
    } catch {
      error('Impossible de charger l’annuaire des utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleUpdateStatus = async (userId: string, status: string, reason?: string) => {
    try {
      await adminService.updateUserStatus(userId, status, reason);
      success('Statut utilisateur mis à jour.');
      loadUsers(pagination.page);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour.');
    }
  };

  const handleUpdateRole = async (userId: string, role: string, reason?: string) => {
    try {
      await adminService.updateUserRole(userId, role, reason);
      success('Rôle utilisateur modifié.');
      loadUsers(pagination.page);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erreur lors du changement de rôle.');
    }
  };

  const handleBanUser = async (userId: string, reason?: string) => {
    try {
      await adminService.banUser(userId, reason);
      success('Utilisateur banni avec succès.');
      loadUsers(pagination.page);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erreur lors du bannissement.');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Gestion des Utilisateurs &amp; Rôles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Annuaire des particuliers, entreprises et administrateurs GayaBTP
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Nom, e-mail ou téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 shadow-inner"
          />
        </div>
      </div>

      {/* Filtres par Rôle & Statut */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: '', label: 'Tous les rôles' },
            { id: 'particulier', label: 'Particuliers' },
            { id: 'professionnel', label: 'Professionnels BTP' },
            { id: 'admin', label: 'Administrateurs' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/90 border border-slate-200/80 dark:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: '', label: 'Tous statuts' },
            { id: 'active', label: 'Actifs' },
            { id: 'suspended', label: 'Suspendus' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-brand-secondary text-white shadow-sm'
                  : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/90 border border-slate-200/80 dark:border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
            <span className="text-xs">Chargement de l’annuaire...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            Aucun compte utilisateur ne correspond à ces critères.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Utilisateur</th>
                  <th className="py-3.5 px-4">Rôle</th>
                  <th className="py-3.5 px-4">Téléphone</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : item.role === 'professionnel'
                          ? 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'
                          : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                      }`}>
                        {item.role === 'admin' ? 'Admin' : item.role === 'professionnel' ? 'Pro BTP' : 'Particulier'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {item.phone || 'Non renseigné'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.status === 'active' ? 'Actif' : item.status === 'suspended' ? 'Suspendu' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(item);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Gérer</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500">
            <span>Page {pagination.page} sur {pagination.totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => loadUsers(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale d'édition */}
      <AdminUserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        onUpdateRole={handleUpdateRole}
        onBanUser={handleBanUser}
      />
    </div>
  );
};

