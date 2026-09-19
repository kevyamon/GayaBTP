import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { proService, ProFilterParams } from '../services/pro.service';
import { IProProfile } from '../types';
import { ProCard } from '../components/pro/ProCard';
import { ProFilters } from '../components/pro/ProFilters';
import { ProContactModal } from '../components/pro/ProContactModal';
import { AnimatedHoneycombGrid } from '../components/common/AnimatedHoneycombGrid';
import { GlassmorphismCard } from '../components/ui/GlassmorphismCard';
import { Button } from '../components/ui/Button';

export const ProsPage: React.FC = () => {
  const [pros, setPros] = useState<IProProfile[]>(() => {
    return proService.getCachedPros();
  });
  const [filters, setFilters] = useState<ProFilterParams>({});
  const [selectedProForContact, setSelectedProForContact] = useState<IProProfile | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return proService.getCachedPros().length === 0;
  });

  const fetchPros = useCallback(async (currentFilters: ProFilterParams) => {
    const cached = proService.getCachedPros(currentFilters);
    if (cached.length > 0) {
      setPros(cached);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    try {
      const data = await proService.getPros(currentFilters);
      setPros(data);
    } catch {
      setPros([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPros(filters);
  }, [filters, fetchPros]);

  const handleFilterChange = (newFilters: ProFilterParams) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleOpenContact = (pro: IProProfile) => {
    setSelectedProForContact(pro);
    setIsContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactModalOpen(false);
    setSelectedProForContact(null);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 lg:pb-16 space-y-8 overflow-hidden">
      {/* Orbes ambiants diffus pour enrichir la réfraction du verre sur toute la page */}
      <div className="absolute top-16 left-12 w-96 h-96 rounded-full bg-brand-accent/20 dark:bg-brand-accent/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-12 w-96 h-96 rounded-full bg-brand-primary/15 dark:bg-brand-primary/15 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-sky-400/15 dark:bg-sky-400/10 blur-3xl pointer-events-none -z-10" />
      
      {/* 1. EN-TÊTE ÉPURÉ DE L'ANNUAIRE */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title text-slate-900 dark:text-white leading-tight">
          Annuaire National des Pros BTP & Experts Fonciers
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Trouvez des géomètres assermentés, architectes inscrits à l’Ordre, maîtres artisans et entreprises générales pour concrétiser et sécuriser vos chantiers en Côte d’Ivoire.
        </p>
      </div>

      {/* 2. BARRE DE FILTRES MULTICRITÈRES (GLASSMORPHISM) */}
      <ProFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={pros.length}
      />

      {/* 3. GRILLE DES PROFESSIONNELS (CARTES GLASSMORPHISM) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="h-64 rounded-brand-xl bg-slate-200/70 dark:bg-slate-800/70 !border-2 !border-brand-primary/40"
            />
          ))}
        </div>
      ) : pros.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pros.map((pro) => (
            <ProCard key={pro._id} pro={pro} onContactClick={handleOpenContact} />
          ))}
        </div>
      ) : (
        <GlassmorphismCard intensity="medium" className="text-center py-16 px-4 space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Aucun professionnel ne correspond à ces critères
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Essayez de modifier votre spécialité ou votre localisation pour élargir votre recherche.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleResetFilters}>
            Réinitialiser les filtres
          </Button>
        </GlassmorphismCard>
      )}

      {/* 4. BANDEAU DE LABELLISATION GAYABTP - EFFET LIQUIDE GLACE & MOTIF RUCHE */}
      <div className="rounded-brand-xl glass-water text-white p-8 sm:p-12 relative overflow-hidden shadow-elevated">
        {/* Reflets liquides caustiques en arrière-plan */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-accent/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-500/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-72 h-72 rounded-full bg-brand-secondary/30 blur-2xl pointer-events-none" />

        {/* Grille de cubes en ruche animée avec onde de pulsation */}
        <AnimatedHoneycombGrid />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 rounded-full bg-white/10 shrink-0 hidden sm:block">
              <ShieldCheck className="w-8 h-8 text-brand-accent" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold leading-tight text-white drop-shadow-md">
                Vous êtes un professionnel du Foncier ou du BTP en Côte d’Ivoire ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-100 max-w-2xl leading-relaxed drop-shadow-sm font-medium">
                Rejoignez l’annuaire certifié GayaBTP pour valoriser vos réalisations, recevoir des demandes de devis qualifiées et obtenir le label Gaya Vérifié.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            className="shrink-0 shadow-lg"
            onClick={() => handleOpenContact({
              _id: 'join',
              userId: 'admin',
              accountType: 'entreprise',
              companyName: 'Service Partenariats Pros GayaBTP',
              specialties: ['Adhésion Professionnelle'],
              city: 'Abidjan',
              isVerified: true,
              verificationStatus: 'verified',
              hasProBadge: true,
            })}
          >
            Demander mon référencement
          </Button>
        </div>
      </div>

      {/* Modale de contact direct */}
      <ProContactModal
        pro={selectedProForContact}
        isOpen={isContactModalOpen}
        onClose={handleCloseContact}
      />

    </div>
  );
};
