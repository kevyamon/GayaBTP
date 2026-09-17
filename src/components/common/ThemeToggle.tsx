import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-brand border border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary shadow-sm transition-smooth cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary ${className}`}
      aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={theme === 'dark' ? 'Basculer en mode clair' : 'Basculer en mode sombre'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-brand-secondary transition-transform -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};
