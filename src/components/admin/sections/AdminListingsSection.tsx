import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { adminService } from '../../../services/admin.service';
import { IListing, IPagination } from '../../../types';
import { AdminListingDetailsModal } from './AdminListingDetailsModal';
import { useToast } from '../../../contexts/ToastContext';

export const AdminListingsSection: React.FC = () => {
  const { success, error } = useToast();

  const [listings, setListings] = useState<IListing[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('pending_review');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedListing, setSelectedListing] = useState<IListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadListings = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await adminService.getListings(page, 15, statusFilter || undefined);
      setListings(data.listings);
      if (data.pagination) setPagination(data.pagination);
    } catch {
      error('Impossible de charger les annonces.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, error]);

  useEffect(() => {
    loadListings(1);
  }, [loadListings]);

  const handleModerate = async (listingId: string, status: 'published' | 'rejected' | 'archived') => {
    try {
      await adminService.moderateListing(listingId, status);
      success('Statut de l’annonce actualisé avec succès.');
      loadListings(pagination.page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la modération.';
      error(msg);
    }
  };

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Modération des Annonces
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Contrôle de conformité des terrains, parcelles et offres de construction
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-black/40 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 shadow-inner"
          />
        </div>
      </div>

      {/* Filtres par statut */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: '', label: 'Toutes' },
          { id: 'pending_review', label: 'En attente' },
          { id: 'published', label: 'Validées' },
          { id: 'rejected', label: 'Rejetées' },
          { id: 'archived', label: 'Archivées' },
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

      {/* Tableau des annonces */}
      <div className="overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/10 shadow-sm">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-secondary" />
            <span className="text-xs">Chargement du registre des annonces...</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            Aucune annonce trouvée dans cette catégorie.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Annonce</th>
                  <th className="py-3.5 px-4">Lieu &amp; Titre</th>
                  <th className="py-3.5 px-4">Prix (FCFA)</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredListings.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || '/logo.png'}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                        />
                        <div className="max-w-[200px]">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">{item.propertyType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.city}</p>
                      <p className="text-[10px] font-bold text-brand-secondary uppercase">{item.titleType || 'ACD'}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.priceFCFA.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'published' || item.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : item.status === 'pending' || item.status === 'pending_review' || item.status === 'draft'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : item.status === 'archived'
                          ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.status === 'published' || item.status === 'active'
                          ? 'En ligne'
                          : item.status === 'pending' || item.status === 'pending_review' || item.status === 'draft'
                          ? 'En attente'
                          : item.status === 'archived'
                          ? 'Archivée'
                          : item.status === 'sold'
                          ? 'Vendue'
                          : 'Rejetée'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedListing(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                        title="Examiner l’annonce"
                      >
                        <Eye className="w-4 h-4" />
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
                onClick={() => loadListings(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadListings(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale d'inspection */}
      <AdminListingDetailsModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedListing(null);
        }}
        onModerate={handleModerate}
      />
    </div>
  );
};

