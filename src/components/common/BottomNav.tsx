import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  ShieldCheck,
  Users,
  Calculator,
  Briefcase,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSecretAdminTrigger } from '../../hooks/useSecretAdminTrigger';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Accueil', path: '/', icon: Home },
  { label: 'Annonces', path: '/annonces', icon: Search },
  { label: 'Vérification', path: '/verification', icon: ShieldCheck },
  { label: 'Pros BTP', path: '/pros', icon: Users },
  { label: 'Calculateur', path: '/calculateur', icon: Calculator },
  { label: 'Emplois', path: '/emplois', icon: Briefcase },
  { label: 'Publier', path: '/publier', icon: PlusCircle },
] as const;

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const secretTrigger = useSecretAdminTrigger({
    requiredHoldSeconds: 10,
    onTrigger: () => {
      window.dispatchEvent(new CustomEvent('gayabtp:open-admin-auth'));
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  // Défilement automatique pour centrer l’onglet actif à chaque changement de page
  useEffect(() => {
    if (activeItemRef.current && scrollRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setTimeout(updateScrollState, 350);
    }
  }, [location.pathname, updateScrollState]);

  // Masquer la TabBar lorsque le footer est visible (sur la page d'accueil)
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsFooterVisible(false);
      return;
    }

    const footer = document.getElementById('main-footer') || document.querySelector('footer');
    if (!footer) {
      setIsFooterVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsFooterVisible(entry ? entry.isIntersecting : false);
      },
      { root: null, threshold: 0.08 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);

  const isRouteActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (isRouteActive(path)) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 140;
    el.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(updateScrollState, 250);
  };

  return (
    <nav
      aria-label="Navigation principale mobile"
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden transition-all duration-300 ease-out transform mb-[env(safe-area-inset-bottom,0px)] touch-manipulation ${
        isFooterVisible
          ? 'translate-y-28 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      {/* Conteneur Capsule Glassmorphism avec Fond Terre Battue & Vivid Orange */}
      <div className="glass-tabbar-capsule relative flex items-center p-1 sm:p-1.5 w-[95vw] max-w-md shadow-2xl touch-manipulation">
        {/* Couche de reflet diagonal interne du verre */}
        <div className="glass-reflection-overlay rounded-full pointer-events-none" aria-hidden="true" />

        {/* Bouton flèche de défilement vers la gauche */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="relative z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/30 active:scale-90 text-white shadow-sm shrink-0 mr-0.5 transition-all cursor-pointer select-none"
            aria-label="Défiler les onglets vers la gauche"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.8px]" />
          </button>
        )}

        {/* Liste défilante horizontalement des onglets */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth w-full px-0.5 py-0.5 touch-pan-x"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.path);
            const isHome = item.path === '/';

            return (
              <Link
                key={item.path}
                ref={active ? activeItemRef : undefined}
                to={item.path}
                onClick={(e) => {
                  handleTabClick(e, item.path);
                  if (isHome) secretTrigger.handlers.onClick(e);
                }}
                {...(isHome
                  ? {
                      onMouseDown: secretTrigger.handlers.onMouseDown,
                      onMouseUp: secretTrigger.handlers.onMouseUp,
                      onMouseLeave: secretTrigger.handlers.onMouseLeave,
                      onTouchStart: secretTrigger.handlers.onTouchStart,
                      onTouchEnd: secretTrigger.handlers.onTouchEnd,
                    }
                  : {})}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={`relative z-10 flex flex-col items-center justify-center min-w-[62px] sm:min-w-[68px] min-h-[48px] sm:min-h-[52px] py-1 px-1 rounded-xl transition-all duration-150 ease-out cursor-pointer active:scale-90 active:opacity-85 select-none shrink-0 touch-manipulation ${
                  active
                    ? 'glass-tabbar-active-pill text-white scale-100 shadow-md'
                    : 'text-white/85 hover:text-white active:bg-white/20'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              >
                <Icon
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 pointer-events-none transition-transform duration-150 ${
                    active
                      ? 'scale-105 stroke-[2.4px] text-white drop-shadow-sm'
                      : 'stroke-[1.9px] text-white/90'
                  }`}
                />
                <span
                  className={`text-[9px] sm:text-[10px] tracking-tight leading-none mt-1 text-center truncate max-w-full px-0.5 select-none pointer-events-none ${
                    active ? 'font-bold text-white drop-shadow-sm' : 'font-medium text-white/85'
                  }`}
                >
                  {item.label}
                </span>
                {isHome && secretTrigger.isHolding && (
                  <span
                    className="absolute bottom-1 left-2 right-2 h-0.5 bg-brand-primary rounded-full transition-all duration-100"
                    style={{ width: `${secretTrigger.progress}%` }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bouton flèche de défilement vers la droite */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="relative z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/30 active:scale-90 text-white shadow-sm shrink-0 ml-0.5 transition-all cursor-pointer select-none"
            aria-label="Défiler les onglets vers la droite"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.8px]" />
          </button>
        )}
      </div>
    </nav>
  );
};

