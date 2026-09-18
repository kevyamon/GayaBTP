import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShieldCheck, Users, Calculator } from 'lucide-react';

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
] as const;

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);

  useEffect(() => {
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
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  const isRouteActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Navigation principale mobile"
      className={`fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 lg:hidden transition-all duration-300 ease-out transform mb-[env(safe-area-inset-bottom,0px)] ${isFooterVisible
          ? 'translate-y-28 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
        }`}
    >
      {/* Conteneur Capsule Glassmorphism avec Fond Terre Battue */}
      <div className="glass-tabbar-capsule relative flex items-center justify-between gap-1.5 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 max-w-[94vw] sm:max-w-md shadow-2xl">
        {/* Couche de reflet diagonal interne du verre */}
        <div className="glass-reflection-overlay rounded-full" aria-hidden="true" />

        {/* Liste des éléments de navigation */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-300 ${active
                  ? 'glass-tabbar-active-pill px-5 sm:px-6 py-2.5 text-white scale-100'
                  : 'px-3.5 sm:px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95'
                }`}
            >
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${active
                    ? 'stroke-[2.4px] fill-white text-white drop-shadow-sm'
                    : 'stroke-[1.9px] text-white/85'
                  }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
