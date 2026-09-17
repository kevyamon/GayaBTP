import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'urgent' | 'verified' | 'outline';
  size?: 'sm' | 'md';
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon = false,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full tracking-wide';
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  const variantClasses = {
    primary: 'bg-brand-primary-light text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary',
    secondary: 'bg-brand-secondary-light text-brand-secondary dark:bg-brand-secondary/20 dark:text-sky-300',
    accent: 'bg-brand-accent-light text-brand-accent-hover dark:bg-brand-accent/20 dark:text-brand-accent',
    urgent: 'bg-amber-100 text-brand-urgent dark:bg-amber-900/30 dark:text-amber-300',
    verified: 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    outline: 'border border-brand-light-border dark:border-brand-dark-border text-slate-600 dark:text-slate-300',
  }[variant];

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}>
      {icon && variant === 'verified' && <ShieldCheck className="w-3.5 h-3.5 mr-1" />}
      {icon && variant === 'accent' && <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
      {icon && variant === 'urgent' && <AlertCircle className="w-3.5 h-3.5 mr-1" />}
      {children}
    </span>
  );
};
