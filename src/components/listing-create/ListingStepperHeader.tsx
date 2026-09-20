import React from 'react';
import { MapPin, ShieldCheck, FileText, Image as ImageIcon, Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { id: 1, label: 'Localisation', icon: MapPin },
  { id: 2, label: 'Titre Foncier', icon: ShieldCheck },
  { id: 3, label: 'Détails & Prix', icon: FileText },
  { id: 4, label: 'Photos & Contact', icon: ImageIcon },
];

export const ListingStepperHeader: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full overflow-hidden px-1">
      <div className="flex items-center justify-between relative max-w-full">
        {/* Ligne de progression d'arrière-plan */}
        <div className="absolute left-2 right-2 top-4 sm:top-5 -translate-y-1/2 h-0.5 sm:h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
        
        {/* Ligne active dynamique */}
        <div
          className="absolute left-2 top-4 sm:top-5 -translate-y-1/2 h-0.5 sm:h-1 bg-brand-primary transition-all duration-300 -z-0"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 96}%` }}
        />

        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isCompleted && !isActive}
              onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              className={`relative z-10 flex flex-col items-center gap-1 group transition-all max-w-[70px] sm:max-w-none ${
                isCompleted ? 'cursor-pointer' : isActive ? 'cursor-default' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-2 sm:ring-4 ring-emerald-100 dark:ring-emerald-950/50'
                    : isActive
                    ? 'bg-brand-primary text-white ring-2 sm:ring-4 ring-brand-primary/20 scale-105'
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>

              <span
                className={`text-[9px] sm:text-xs font-semibold text-center truncate max-w-full px-0.5 leading-none ${
                  isActive
                    ? 'text-brand-primary dark:text-brand-primary font-bold'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

