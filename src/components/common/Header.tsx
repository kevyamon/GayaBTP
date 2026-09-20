import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  ShieldCheck,
  Users,
  Calculator,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  UserCheck,
  LogIn,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Terrains & Annonces', path: '/annonces', icon: Search },
    { name: 'Vérification Foncière', path: '/verification', icon: ShieldCheck },
    { name: 'Annuaire Pros BTP', path: '/pros', icon: Users },
    { name: 'Calculateur Foncier', path: '/calculateur', icon: Calculator },
    { name: 'Emplois & Stages', path: '/emplois', icon: Briefcase },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const updateScrollState = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = navScrollRef.current;
    if (!el) return;
    const scrollAmount = 160;
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-brand-light-border dark:border-brand-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Officiel GayaBTP Arrondi */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden ring-2 ring-brand-primary/25 dark:ring-white/15 shadow-sm flex items-center justify-center bg-white dark:bg-brand-dark-surface shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img
                src="/logo.png"
                alt="Logo GayaBTP"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="font-title text-2xl sm:text-3xl tracking-wide text-brand-secondary dark:text-white leading-none">
              Gaya<span className="text-brand-primary">BTP</span>
            </span>
          </Link>

          {/* Navigation Bureau — Style TabBar Épuré avec Défilement Fluide */}
          <div className="hidden lg:flex items-center relative flex-1 max-w-md xl:max-w-xl 2xl:max-w-2xl bg-slate-100/90 dark:bg-brand-dark-surface/90 border border-brand-light-border dark:border-brand-dark-border rounded-full p-1 shadow-sm backdrop-blur-md mx-2">
            {/* Flèche de défilement vers la gauche */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-brand-dark shadow-sm text-slate-600 dark:text-slate-200 hover:text-brand-primary transition-colors shrink-0 ml-0.5"
                aria-label="Défiler vers la gauche"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
              </button>
            )}

            {/* Conteneur défilant des onglets */}
            <nav
              ref={navScrollRef}
              onScroll={updateScrollState}
              className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth px-1 w-full"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ease-out shrink-0 select-none ${
                      active
                        ? 'bg-white dark:bg-brand-dark text-brand-primary shadow-sm scale-[1.02]'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-brand-dark/40'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${active ? 'stroke-[2.5px] text-brand-primary' : 'stroke-2'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Flèche de défilement vers la droite */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-brand-dark shadow-sm text-slate-600 dark:text-slate-200 hover:text-brand-primary transition-colors shrink-0 mr-0.5"
                aria-label="Défiler vers la droite"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
              </button>
            )}
          </div>

          {/* Actions & Boutons d'accès */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link to="/dashboard" className="shrink-0">
                <Button variant="outline" size="sm" leftIcon={<UserCheck className="w-4 h-4 shrink-0" />} className="whitespace-nowrap">
                  {user?.name.split(' ')[0] || 'Mon Compte'}
                </Button>
              </Link>
            ) : (
              <Link to="/login" className="shrink-0">
                <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4 shrink-0" />} className="whitespace-nowrap">
                  Connexion
                </Button>
              </Link>
            )}

            <Link to="/publier" className="shrink-0">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4 shrink-0" />}
                className="shadow-md whitespace-nowrap px-3.5 sm:px-4"
              >
                Publier une annonce
              </Button>
            </Link>
          </div>

          {/* Contrôles Mobile : Toggle Thème + Bouton Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-brand text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-brand-dark-surface transition-colors"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-brand-light-border dark:border-brand-dark-border bg-white dark:bg-brand-dark-surface animate-in slide-in-from-top-2 duration-200 shadow-elevated">
          <div className="px-4 py-5 flex flex-col gap-3">
            <Link to="/publier" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth leftIcon={<PlusCircle className="w-4 h-4" />} className="shadow-md">
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
      )}
    </header>
  );
};
