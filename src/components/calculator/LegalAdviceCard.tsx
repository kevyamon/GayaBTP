import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Scale, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';

export const LegalAdviceCard: React.FC = () => {
  return (
    <GlassmorphismCard intensity="medium" className="p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 text-brand-secondary dark:text-sky-300">
        <Scale className="w-5 h-5 shrink-0" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Règles d’Or de Sécurité Juridique en Côte d’Ivoire
        </h3>
      </div>

      <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Règle 1 : Obligation notariée */}
        <div className="flex items-start gap-3 p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
          <p>
            <strong>Monopole de l’acte authentique :</strong> En Côte d’Ivoire, toute vente de terrain ou d’immeuble immatriculé doit impérativement être reçue par un notaire sous peine de nullité absolue.
          </p>
        </div>

        {/* Règle 2 : Compte Séquestre */}
        <div className="flex items-start gap-3 p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 backdrop-blur-sm">
          <AlertTriangle className="w-4 h-4 text-brand-urgent shrink-0 mt-0.5" />
          <p>
            <strong>Paiement sécurisé sur compte séquestre :</strong> Ne versez jamais d’acompte en espèces ou par transfert direct à un démarcheur. Les fonds doivent transiter sur le compte officiel de l’étude notariale.
          </p>
        </div>

        {/* Règle 3 : Livre Foncier */}
        <div className="flex items-start gap-3 p-3 rounded-brand bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 backdrop-blur-sm">
          <Scale className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <p>
            <strong>Purge des droits et état des charges :</strong> Le notaire exige un état des droits réels auprès de la Conservation Foncière DGI pour vérifier l’absence d’hypothèque ou de litige avant la signature définitive.
          </p>
        </div>
      </div>

      {/* Raccourcis utiles */}
      <div className="pt-2 border-t border-white/40 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Link to="/verification" className="w-full sm:w-auto">
          <Button variant="outline" size="sm" fullWidth leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
            Vérifier un titre sur les portails d’État
          </Button>
        </Link>
        <Link to="/pros" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Trouver un géomètre ou notaire
          </Button>
        </Link>
      </div>
    </GlassmorphismCard>
  );
};
