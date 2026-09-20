import React from 'react';
import { MapPin, Clock, Coins, Send } from 'lucide-react';
import { IJobOffer } from '../../services/job.service';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { Button } from '../ui/Button';

interface JobCardProps {
  job: IJobOffer;
  onApply: (job: IJobOffer) => void;
}

const CONTRACT_BADGES: Record<string, { bg: string; text: string }> = {
  CDI: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-700 dark:text-emerald-400' },
  CDD: { bg: 'bg-sky-500/15 border-sky-500/30', text: 'text-sky-700 dark:text-sky-400' },
  Stage: { bg: 'bg-purple-500/15 border-purple-500/30', text: 'text-purple-700 dark:text-purple-400' },
  Prestation: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-700 dark:text-amber-400' },
  Freelance: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-700 dark:text-amber-400' },
};

export const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const badgeStyle = CONTRACT_BADGES[job.contractType] || {
    bg: 'bg-slate-500/15 border-slate-500/30',
    text: 'text-slate-700 dark:text-slate-300',
  };

  return (
    <GlassmorphismCard
      intensity="medium"
      className="p-5 sm:p-6 space-y-4 glassmorphism-interactive transition-all flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* En-tête : Entreprise, Contrat & Badge Urgent */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider truncate block">
              {job.companyName}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {job.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {job.isUrgent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-urgent/15 text-brand-urgent border border-brand-urgent/30">
                Recrutement Urgent
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle.bg} ${badgeStyle.text}`}
            >
              {job.contractType}
            </span>
          </div>
        </div>

        {/* Localisation & Rémunération */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {job.city}
              {job.district ? ` • ${job.district}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {job.salaryRangeFCFA}
            </span>
          </div>
        </div>

        {/* Description courte du poste */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {job.description}
        </p>

        {/* Compétences clés requises */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/60 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Pied de carte : Date de publication & Bouton Postuler */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>Publié {job.postedAt.toLowerCase()}</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onApply(job)}
          rightIcon={<Send className="w-3.5 h-3.5" />}
        >
          Postuler
        </Button>
      </div>
    </GlassmorphismCard>
  );
};
