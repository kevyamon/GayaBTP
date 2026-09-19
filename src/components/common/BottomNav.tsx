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
      {
        root: null,
        threshold: 0.08,
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

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (isRouteActive(path)) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
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
      <div className="glass-tabbar-capsule relative grid grid-cols-5 items-stretch gap-1 p-1.5 sm:p-2 w-[95vw] max-w-md shadow-2xl touch-manipulation">
        {/* Couche de reflet diagonal interne du verre */}
        <div className="glass-reflection-overlay rounded-full pointer-events-none" aria-hidden="true" />

        {/* Liste des éléments de navigation avec zone de frappe tactile maximale et réactivité 0ms */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleTabClick(e, item.path)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              className={`relative z-10 flex flex-col items-center justify-center min-h-[48px] sm:min-h-[52px] py-1.5 px-0.5 sm:py-2 sm:px-1 rounded-xl transition-all duration-150 ease-out cursor-pointer active:scale-90 active:opacity-85 select-none min-w-0 touch-manipulation ${
                active
                  ? 'glass-tabbar-active-pill text-white scale-100 shadow-md'
                  : 'text-white/85 hover:text-white active:bg-white/20'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 pointer-events-none transition-transform duration-150 ${
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
