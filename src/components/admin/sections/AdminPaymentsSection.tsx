import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { adminService, IPaymentItem } from '../../../services/admin.service';
import { IPagination } from '../../../types';
import { useToast } from '../../../contexts/ToastContext';

export const AdminPaymentsSection: React.FC = () => {
  const { error } = useToast();

  const [payments, setPayments] = useState<IPaymentItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadPayments = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getPayments(page, 15, statusFilter || undefined);
      setPayments(data.payments);
      if (data.pagination) setPagination(data.pagination);
    } catch {
      error('Impossible de charger les transactions financières.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, error]);

  useEffect(() => {
    loadPayments(1);
  }, [loadPayments]);

  const filteredPayments = payments.filter((item) => {
    const user = item.userId;
    return (
      item.transactionReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Supervision des Encaissements Genius Pay
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Traçabilité des abonnements SaaS et des options de visibilité Mobile Money & Cartes
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Référence ou email client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 shadow-inner"
          />
        </div>
      </div>

      {/* Bannière d'information Genius Pay */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-xs">
        <CreditCard className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="leading-relaxed">
          <strong>Passerelle Automatisée :</strong> Les transactions sont traitées et validées automatiquement par les Webhooks sécurisés de Genius Pay (Wave, MTN MoMo, Orange Money, Cartes Bancaires).
        </p>
      </div>

      {/* Onglets de statut */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: '', label: 'Toutes les transactions' },
          { id: 'verified', label: 'Encaissées avec succès' },
          { id: 'pending', label: 'En attente de règlement' },
          { id: 'failed', label: 'Échouées' },
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

      {/* Tableau des transactions */}
      <div className="overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
            <span className="text-xs">Chargement du journal des paiements...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            Aucune transaction financière enregistrée pour cette sélection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Référence & Date</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Formule / Service</th>
                  <th className="py-3.5 px-4">Montant & Méthode</th>
                  <th className="py-3.5 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredPayments.map((item) => {
                  const user = item.userId;
                  const plan = item.planId;
                  const dateFormatted = new Date(item.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-mono font-bold text-slate-900 dark:text-white">{item.transactionReference}</p>
                        <p className="text-[10px] text-slate-400">{dateFormatted}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Client GayaBTP'}</p>
                        <p className="text-[10px] text-slate-400">{user?.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 dark:text-white">{plan?.name || 'Abonnement Pro'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-black text-emerald-600 dark:text-emerald-400">
                          {item.amountFCFA.toLocaleString('fr-FR')} FCFA
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {item.paymentMethod || 'Mobile Money'}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'verified'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : item.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {item.status === 'verified' ? 'Encaissé' : item.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
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
                onClick={() => loadPayments(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadPayments(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
