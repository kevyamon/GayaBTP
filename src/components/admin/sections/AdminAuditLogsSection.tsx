import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  User,
} from 'lucide-react';
import { adminService, IAuditLogItem } from '../../../services/admin.service';
import { IPagination } from '../../../types';
import { useToast } from '../../../contexts/ToastContext';


export const AdminAuditLogsSection: React.FC = () => {
  const { error } = useToast();

  const [logs, setLogs] = useState<IAuditLogItem[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);

  const loadLogs = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getAuditLogs(page, 20);
      setLogs(data.logs);
      if (data.pagination) setPagination(data.pagination);
    } catch {
      error('Impossible de charger le registre d’audit.');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadLogs(1);
  }, [loadLogs]);

  const formatActionName = (action: string) => {
    return action
      .replace(/^admin_/, '')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Journal d’Audit & Traçabilité Forteresse
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historique inaltérable de l’ensemble des opérations effectuées par les administrateurs
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLogs(pagination.page)}
          disabled={isLoading}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer self-start sm:self-auto"
          title="Actualiser le journal"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-secondary' : ''}`} />
        </button>
      </div>

      {/* Tableau d'audit */}
      <div className="overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
            <span className="text-xs">Extraction du journal de sécurité...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            Aucun événement consigné dans le registre pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Administrateur</th>
                  <th className="py-3.5 px-4">Action Enregistrée</th>
                  <th className="py-3.5 px-4 text-right">Ressource Ciblée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {logs.map((log) => {
                  const dateFormatted = new Date(log.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  return (
                    <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
                            <User className="w-3 h-3" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                              {log.actor.email}
                            </p>
                            <span className="text-[9px] font-bold text-brand-secondary uppercase">
                              {log.actor.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatActionName(log.action)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {log.resource} {log.resourceId ? `#${log.resourceId.slice(-6)}` : ''}
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
                onClick={() => loadLogs(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadLogs(pagination.page + 1)}
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
