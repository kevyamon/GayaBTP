import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShieldCheck, Users, Calculator } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Accueil', path: '/', icon: Home },
    { label: 'Annonces', path: '/annonces', icon: Search },
    { label: 'Vérification', path: '/verification', icon: ShieldCheck },
    { label: 'Pros BTP', path: '/pros', icon: Users },
    { label: 'Calculateur', path: '/calculateur', icon: Calculator },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav aria-label="Navigation mobile" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-t border-brand-light-border dark:border-brand-dark-border lg:hidden transition-colors duration-200">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-smooth ${
                active
                  ? 'text-brand-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
