import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Phone, MessageCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { IProProfile } from '../../types';
import { Button } from '../ui/Button';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

interface ProCardProps {
  pro: IProProfile;
  onContactClick?: (pro: IProProfile) => void;
}

export const ProCard: React.FC<ProCardProps> = ({ pro, onContactClick }) => {
  const whatsappUrl = pro.phoneWhatsApp
    ? `https://wa.me/${pro.phoneWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      `Bonjour ${pro.companyName}, j’ai trouvé votre profil sur GayaBTP et je souhaiterais échanger avec vous pour un projet BTP / Foncier.`
    )}`
    : undefined;

  return (
    <div className="relative group h-full flex flex-col">
      {/* Orbes de diffusion et réfraction d'arrière-plan (identique à TEST E) */}
      <div className="absolute top-2 left-2 w-32 h-32 rounded-full bg-brand-accent/35 dark:bg-brand-accent/25 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute bottom-2 right-2 w-36 h-36 rounded-full bg-brand-primary/30 dark:bg-brand-primary/20 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      <GlassmorphismCard
        intensity="medium"
        interactive
        className="flex flex-col justify-between flex-1 relative z-10 !border-2 !border-brand-primary dark:!border-brand-primary shadow-sm hover:!border-brand-primary-hover transition-colors"
      >
        {/* Badge d’angle Gaya Vérifié — Collé à l'angle supérieur droit */}
        {pro.isVerified && (
          <div
            className="absolute top-0 right-0 z-30 flex items-center gap-1.5 pl-3.5 pr-3 pt-1.5 pb-1.5 rounded-bl-2xl bg-brand-accent text-slate-900 font-bold text-[11px] shadow-sm tracking-tight border-b border-l border-white/60 dark:border-white/20 select-none backdrop-blur-sm"
            title="Professionnel vérifié et certifié par l’équipe technique GayaBTP"
          >
            <Check className="w-3.5 h-3.5 stroke-[3] text-slate-900" />
            <span>Gaya Vérifié</span>
          </div>
        )}

        {/* Contenu de la carte avec espacement et padding interne */}
        <div className="p-5 sm:p-6 flex flex-col justify-between space-y-5 flex-1">
          <div className="space-y-3.5">
            {/* 1. Ligne supérieure : Avatar + Type de prestataire (avec dégagement pour le badge d'angle) */}
            <div className="flex items-center gap-3 pr-28">
              <div className="relative shrink-0">
                {pro.avatarUrl ? (
                  <img
                    src={pro.avatarUrl}
                    alt={pro.companyName}
                    className="w-12 h-12 rounded-brand-lg object-cover border border-white/70 dark:border-white/15 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-brand-lg bg-brand-secondary/15 dark:bg-brand-secondary/35 flex items-center justify-center text-brand-secondary font-bold text-base border border-white/60 dark:border-white/15">
                    {pro.companyName.charAt(0)}
                  </div>
                )}
                {pro.isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 bg-brand-accent text-slate-900 rounded-full p-0.5 shadow-sm border border-white dark:border-slate-900"
                    title="Professionnel vérifié par l’équipe technique GayaBTP"
                  >
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                  {pro.accountType === 'entreprise' ? 'Entreprise BTP' : 'Maître Artisan'}
                </span>
              </div>
            </div>

            {/* 2. Titre de l'entreprise déployé sur TOUTE la largeur de la carte */}
            <h3
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate w-full"
              title={pro.companyName}
            >
              {pro.companyName}
            </h3>

            {/* 3. Ligne Localisation & Expérience (affichage complet et espacement naturel) */}
            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span>
                  {pro.city}
                  {pro.district ? ` • ${pro.district}` : ''}
                </span>
              </div>
              {pro.yearsOfExperience && (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{pro.yearsOfExperience} ans d’expérience</span>
                </div>
              )}
            </div>

            {/* Spécialités */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {pro.specialties.map((spec, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-200 backdrop-blur-sm"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Bio courte */}
            {pro.bio && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {pro.bio}
              </p>
            )}

            {/* Indicateurs clés */}
            {pro.completedProjectsCount && (
              <div className="pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Chantiers & missions réalisés</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {pro.completedProjectsCount}+ projets
                </span>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="pt-2 flex items-center gap-2">
            <Link to={`/pros/${pro._id}`} className="flex-1">
              <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Voir le profil
              </Button>
            </Link>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-brand bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-colors border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm"
                title="Contacter sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            ) : onContactClick ? (
              <button
                type="button"
                onClick={() => onContactClick(pro)}
                className="p-2 rounded-brand bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 transition-colors border border-white/60 dark:border-white/10 backdrop-blur-sm"
                title="Contacter ce professionnel"
              >
                <Phone className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      </GlassmorphismCard>
    </div>
  );
};
