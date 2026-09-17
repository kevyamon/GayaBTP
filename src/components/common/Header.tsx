import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle, UserCheck, LogIn } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Terrains & Annonces', path: '/annonces' },
    { name: 'Vérification Foncière', path: '/verification' },
    { name: 'Annuaire Pros BTP', path: '/pros' },
    { name: 'Calculateur Foncier', path: '/calculateur' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-brand-light-border dark:border-brand-dark-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Officiel GayaBTP */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="GayaBTP Logo"
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-title text-2xl tracking-wide text-brand-secondary dark:text-white">
                Gaya<span className="text-brand-primary">BTP</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                Foncier & BTP Côte d’Ivoire
              </span>
            </div>
          </Link>

          {/* Navigation Bureau */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-brand text-sm font-semibold transition-smooth ${
                  isActive(link.path)
                    ? 'text-brand-primary bg-brand-primary-light dark:bg-brand-primary/15'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-brand-dark-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Boutons d'accès */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm" leftIcon={<UserCheck className="w-4 h-4" />}>
                  {user?.name.split(' ')[0] || 'Mon Compte'}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                  Connexion
                </Button>
              </Link>
            )}

            <Link to="/publier">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="shadow-md"
              >
                Publier une annonce
              </Button>
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-brand text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-dark-surface"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-brand text-base font-semibold ${
                  isActive(link.path)
                    ? 'text-brand-primary bg-brand-primary-light dark:bg-brand-primary/20'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-brand-light-border dark:border-brand-dark-border flex flex-col gap-3">
              <Link to="/publier" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth leftIcon={<PlusCircle className="w-4 h-4" />}>
                  Publier une annonce
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth leftIcon={<UserCheck className="w-4 h-4" />}>
                    Mon Espace GayaBTP
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                    Se connecter / S’inscrire
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
