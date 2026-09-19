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
      className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden transition-all duration-300 ease-out transform mb-[env(safe-area-inset-bottom,0px)] ${
        isFooterVisible
          ? 'translate-y-28 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100 pointer-events-auto'
      }`}
    >
      {/* Conteneur Capsule Glassmorphism avec Fond Terre Battue & Vivid Orange */}
      <div className="glass-tabbar-capsule relative grid grid-cols-5 items-center gap-1 px-1.5 py-1.5 sm:px-2.5 sm:py-2 w-[95vw] max-w-md shadow-2xl">
        {/* Couche de reflet diagonal interne du verre */}
        <div className="glass-reflection-overlay rounded-full pointer-events-none" aria-hidden="true" />

        {/* Liste des éléments de navigation avec libellés en dessous de l'icône */}
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
              className={`relative z-10 flex flex-col items-center justify-center py-1.5 px-0.5 sm:py-2 sm:px-1 rounded-xl transition-all duration-200 ease-out active:scale-95 select-none min-w-0 ${
                active
                  ? 'glass-tabbar-active-pill text-white scale-100 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 ${
                  active
                    ? 'scale-105 stroke-[2.4px] text-white drop-shadow-sm'
                    : 'stroke-[1.9px] text-white/85'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] tracking-tight leading-none mt-1 text-center truncate max-w-full px-0.5 select-none ${
                  active ? 'font-bold text-white drop-shadow-sm' : 'font-medium text-white/80'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
