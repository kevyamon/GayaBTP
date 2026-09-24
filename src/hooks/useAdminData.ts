import { useState, useEffect, useCallback } from 'react';
import { adminService, DashboardStats } from '../services/admin.service';
import { IListing } from '../types';
import { clientSocketService } from '../services/socket.service';
import { useToast } from '../contexts/ToastContext';


export type AdminSection =
  | 'kpis'
  | 'listings'
  | 'verifications'
  | 'payments'
  | 'users'
  | 'admins'
  | 'audit';

export const useAdminData = () => {
  const { info, success } = useToast();

  const [activeSection, setActiveSection] = useState<AdminSection>('kpis');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);

  // 1. Chargement des statistiques globales du tableau de bord
  const refreshStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch {
      // Erreur silencieuse ou gérée par l'intercepteur API
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // 2. Écouteurs WebSocket en temps réel sur la salle privée d'administration
  useEffect(() => {
    const unsubKpis = clientSocketService.on<DashboardStats>('admin:kpis_update', (newStats) => {
      setStats(newStats);
    });

    const unsubListing = clientSocketService.on<{ listing: IListing }>(
      'listing:submitted',
      (payload) => {
        info('Nouvelle annonce soumise', `L’annonce "${payload.listing.title}" est en attente.`);
        setStats((prev) => (prev ? { ...prev, totalListings: prev.totalListings + 1 } : prev));
      }
    );

    const unsubVerification = clientSocketService.on<{ companyName: string }>(
      'verification:submitted',
      (payload) => {
        info('Nouveau dossier pro', `Demande de badge pour "${payload.companyName}".`);
        setStats((prev) =>
          prev ? { ...prev, pendingVerifications: prev.pendingVerifications + 1 } : prev
        );
      }
    );

    const unsubPayment = clientSocketService.on<{ amountFCFA: number }>(
      'payment:verified',
      (payload) => {
        success('Paiement validé en direct', `Encaissement de ${payload.amountFCFA.toLocaleString('fr-FR')} FCFA.`);
        refreshStats();
      }
    );

    return () => {
      unsubKpis();
      unsubListing();
      unsubVerification();
      unsubPayment();
    };
  }, [info, success, refreshStats]);

  return {
    activeSection,
    setActiveSection,
    stats,
    isLoadingStats,
    refreshStats,
  };
};
