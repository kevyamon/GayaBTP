import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { IProServiceItem, IProProjectItem } from '../../types';

interface ProServicesPortfolioProps {
  services?: IProServiceItem[];
  portfolio?: IProProjectItem[];
}

export const ProServicesPortfolio: React.FC<ProServicesPortfolioProps> = ({
  services,
  portfolio,
}) => {
  return (
    <div className="space-y-8">
      
      {/* Grille des prestations & tarifs indicatifs */}
      {services && services.length > 0 && (
        <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-brand-xl p-6 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Prestations & Tarifs Indicatifs
            </h3>
            <span className="text-[11px] text-slate-400">Devis final sur étude</span>
          </div>

          <div className="divide-y divide-brand-light-border dark:divide-brand-dark-border">
            {services.map((svc, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {svc.title}
                    </span>
                  </div>
                  {svc.indicativePriceFCFA ? (
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-brand-primary">
                        {svc.indicativePriceFCFA.toLocaleString('fr-FR')}&nbsp;FCFA
                      </span>
                      {svc.unit && (
                        <span className="block text-[10px] text-slate-400">
                          / {svc.unit}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">Sur devis</span>
                  )}
                </div>
                {svc.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                    {svc.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio de réalisations */}
      {portfolio && portfolio.length > 0 && (
        <div className="bg-white dark:bg-brand-dark-surface border border-brand-light-border dark:border-brand-dark-border rounded-brand-xl p-6 space-y-5 shadow-card">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Galerie de Réalisations & Chantiers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((item, idx) => (
              <div
                key={idx}
                className="rounded-brand border border-brand-light-border dark:border-brand-dark-border overflow-hidden bg-slate-50 dark:bg-brand-dark space-y-2.5 shadow-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>{item.location}</span>
                    {item.year && <span>{item.year}</span>}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
