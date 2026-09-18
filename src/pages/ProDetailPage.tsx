import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  ShieldCheck,
  Phone,
  MessageCircle,
  Mail,
  ArrowLeft,
  FolderGit2,
} from 'lucide-react';
import { proService } from '../services/pro.service';
import { IProProfile } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProServicesPortfolio } from '../components/pro/ProServicesPortfolio';
import { ProContactModal } from '../components/pro/ProContactModal';

export const ProDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pro, setPro] = useState<IProProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      proService
        .getProById(id)
        .then(setPro)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-brand-xl" />
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Professionnel introuvable
        </h2>
        <p className="text-xs text-slate-500">
          Ce profil n’existe pas ou a été désactivé.
        </p>
        <Link to="/pros">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Retour à l’annuaire
          </Button>
        </Link>
      </div>
    );
  }

  const whatsappUrl = pro.phoneWhatsApp
    ? `https://wa.me/${pro.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour ${pro.companyName}, j’ai consulté votre fiche détaillée sur GayaBTP et je souhaiterais solliciter vos services.`
      )}`
    : undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 lg:pb-16 space-y-8">
      
      {/* 1. BOUTON RETOUR */}
      <Link
        to="/pros"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à l’annuaire des professionnels</span>
      </Link>

      {/* 2. BANNIÈRE & EN-TÊTE PROFIL */}
      <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-brand-xl overflow-hidden shadow-card">
        {pro.coverUrl ? (
          <div className="h-44 sm:h-56 w-full overflow-hidden relative">
            <img src={pro.coverUrl} alt={pro.companyName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="h-28 bg-gradient-to-r from-brand-secondary to-slate-900" />
        )}

        <div className="p-6 sm:p-8 space-y-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            <div className="relative">
              {pro.avatarUrl ? (
                <img
                  src={pro.avatarUrl}
                  alt={pro.companyName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-brand-xl object-cover border-4 border-white dark:border-brand-dark-surface shadow-elevated bg-white"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-brand-xl bg-brand-secondary text-white font-title text-3xl flex items-center justify-center border-4 border-white dark:border-brand-dark-surface shadow-elevated">
                  {pro.companyName.charAt(0)}
                </div>
              )}
              {pro.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-brand bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp direct</span>
                </a>
              )}
              <Button
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => setIsContactModalOpen(true)}
              >
                Demander un devis
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                {pro.accountType === 'entreprise' ? 'Entreprise BTP Agréée' : 'Maître Artisan Certifié'}
              </span>
              {pro.isVerified && (
                <Badge variant="verified" size="sm" icon>
                  Gaya Vérifié & Assermenté
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-title text-slate-900 dark:text-white">
              {pro.companyName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>
                  {pro.city}
                  {pro.district ? ` • ${pro.district}` : ''}
                </span>
              </div>
              {pro.yearsOfExperience && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{pro.yearsOfExperience} ans d’expérience</span>
                </div>
              )}
              {pro.completedProjectsCount && (
                <div className="flex items-center gap-1">
                  <FolderGit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{pro.completedProjectsCount}+ réalisations</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {pro.specialties.map((spec, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CONTENU PRINCIPAL : PRÉSENTATION & PRESTATIONS & PORTFOLIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Détails, Services & Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          {pro.bio && (
            <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-brand-xl p-6 space-y-3 shadow-card">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                À propos de l’entreprise
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {pro.bio}
              </p>
            </div>
          )}

          <ProServicesPortfolio services={pro.services} portfolio={pro.portfolio} />
        </div>

        {/* Colonne Droite : Coordonnées, Déontologie & Prise de contact */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-brand-xl p-6 space-y-4 shadow-card">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Coordonnées de l’Établissement
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                <span>
                  {pro.city}
                  {pro.district ? `, ${pro.district}` : ''}, Côte d’Ivoire
                </span>
              </div>
              {pro.phoneCall && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-secondary shrink-0" />
                  <a href={`tel:${pro.phoneCall}`} className="hover:underline font-semibold">
                    {pro.phoneCall}
                  </a>
                </div>
              )}
              {pro.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${pro.email}`} className="hover:underline truncate">
                    {pro.email}
                  </a>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsContactModalOpen(true)}
            >
              Solliciter une intervention
            </Button>
          </div>

          <div className="p-5 rounded-brand-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Garantie Transparence GayaBTP</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Ce prestataire a fait l’objet d’un contrôle d’immatriculation et s’engage au respect de la charte de déontologie des travaux en Côte d’Ivoire.
            </p>
          </div>
        </div>

      </div>

      {/* Modale de devis direct */}
      <ProContactModal
        pro={pro}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

    </div>
  );
};
