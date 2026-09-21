import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { adminService, IVerificationItem } from '../../../services/admin.service';
import { IPagination } from '../../../types';
import { AdminVerificationReviewModal } from './AdminVerificationReviewModal';
import { useToast } from '../../../contexts/ToastContext';

export const AdminVerificationsSection: React.FC = () => {
  const { success, error } = useToast();

  const [verifications, setVerifications] = useState<IVerificationItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedVerification, setSelectedVerification] = useState<IVerificationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadVerifications = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getVerifications(page, 15, statusFilter || undefined);
      setVerifications(data.verifications);
      if (data.pagination) setPagination(data.pagination);
    } catch {
      error('Impossible de charger les dossiers de certification.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, error]);

  useEffect(() => {
    loadVerifications(1);
  }, [loadVerifications]);

  const handleReview = async (requestId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      await adminService.reviewVerification(requestId, action, notes);
      success(
        action === 'approve' ? 'Badge Vérifié accordé' : 'Demande rejetée',
        'Le statut du profil et les notifications associées ont été actualisés.'
      );
      loadVerifications(pagination.page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du traitement.';
      error(msg);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Audit des Certifications Professionnelles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Attribution rigoureuse du Badge Vérifié après examen des pièces légales
          </p>
        </div>
      </div>

      {/* Onglets de statut */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: '', label: 'Tous les dossiers' },
          { id: 'pending', label: 'En attente d’audit' },
          { id: 'approved', label: 'Certifiés & Vérifiés' },
          { id: 'rejected', label: 'Rejetés' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                : 'bg-white/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/90 border border-slate-200/80 dark:border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tableau des demandes */}
      <div className="overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
            <span className="text-xs">Chargement des dossiers en cours...</span>
          </div>
        ) : verifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            Aucun dossier trouvé dans cette sélection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Professionnel / Entreprise</th>
                  <th className="py-3.5 px-4">Demandeur</th>
                  <th className="py-3.5 px-4">Pièces fournies</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {verifications.map((item) => {
                  const pro = item.proProfileId;
                  const user = item.userId;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {pro?.companyName || 'Entreprise BTP'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                          {pro?.accountType || 'Pro indépendant'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
                        <p className="text-[10px] text-slate-400">{user?.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.idCardDocument?.url && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              CNI
                            </span>
                          )}
                          {item.businessLicenseDocument?.url && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              RCCM
                            </span>
                          )}
                          {item.diplomaDocument?.url && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              Diplôme
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : item.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {item.status === 'approved' ? 'Vérifié' : item.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVerification(item);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Examiner</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
                onClick={() => loadVerifications(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadVerifications(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale d'examen */}
      <AdminVerificationReviewModal
        verification={selectedVerification}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVerification(null);
        }}
        onReview={handleReview}
      />
    </div>
  );
};
