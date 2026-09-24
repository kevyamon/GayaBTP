import React, { useState, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import { IJobOffer, JobFilterParams, jobService } from '../services/job.service';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobCard } from '../components/jobs/JobCard';
import { JobApplicationModal } from '../components/jobs/JobApplicationModal';

export const JobsPage: React.FC = () => {
  const [filters, setFilters] = useState<JobFilterParams>({
    search: '',
    specialty: 'all',
    contractType: 'all',
    city: 'all',
  });

  const [jobs, setJobs] = useState<IJobOffer[]>(() => {
    return jobService.getCachedJobs();
  });

  const [selectedJob, setSelectedJob] = useState<IJobOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    jobService.getJobs(filters).then((data) => {
      if (isMounted) setJobs(data);
    });
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleApply = (job: IJobOffer) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      specialty: 'all',
      contractType: 'all',
      city: 'all',
    });
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-36 sm:pb-40 lg:pb-16 space-y-8 overflow-hidden">
      {/* Orbes ambiants diffus */}
      <div className="absolute top-16 left-12 w-96 h-96 rounded-full bg-brand-primary/15 dark:bg-brand-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-12 w-96 h-96 rounded-full bg-brand-secondary/15 dark:bg-brand-secondary/10 blur-3xl pointer-events-none -z-10" />

      {/* 1. En-tête principal */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-title text-slate-900 dark:text-white leading-tight">
          Bourse de l’Emploi &amp; Stages BTP
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Accédez aux opportunités professionnelles qualifiées du BTP en Côte d’Ivoire : conducteurs de travaux, géomètres, ingénieurs, techniciens et stagiaires.
        </p>
      </div>

      {/* 2. Barre de filtres multicritères */}
      <div className="relative z-10">
        <JobFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResults={jobs.length}
        />
      </div>

      {/* 3. Grille des offres d’emploi */}
      <div className="relative z-10">
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 space-y-3 bg-white/40 dark:bg-slate-900/40 rounded-brand-xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm max-w-md mx-auto">
            <SearchX className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Aucune offre ne correspond à vos critères
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Essayez d’élargir vos filtres de recherche géographique ou de spécialité.
            </p>
          </div>
        )}
      </div>

      {/* 4. Modale de candidature rapide */}
      <JobApplicationModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
};
