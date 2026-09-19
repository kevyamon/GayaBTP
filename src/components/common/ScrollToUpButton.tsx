import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Bouton Flottant ScrollToUp (Desktop) — GayaBTP
 * - Détecte le défilement (seuil à 350px)
 * - Rendu circulaire avec logo GayaBTP en fond & overlay translucide
 * - Flèche ArrowUp contrastée avec transition au survol
 * - Clic avec défilement fluide vers le haut
 * - Masqué sur mobile pour préserver l'ergonomie tactile
 */
export const ScrollToUpButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 350) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Remonter en haut de page"
      title="Remonter en haut de page"
      className={`fixed bottom-8 right-8 z-40 hidden lg:flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-white/50 dark:border-white/20 shadow-elevated dark:shadow-elevated-dark cursor-pointer select-none transition-all duration-300 ease-out transform group focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      {/* 1. Image du logo officiel GayaBTP en arrière-plan */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500 pointer-events-none"
      />

      {/* 2. Overlay protecteur et diffus de verre (Glassmorphism sombre s'illuminant aux couleurs de la marque) */}
      <div className="absolute inset-0 bg-slate-950/65 dark:bg-slate-950/75 backdrop-blur-[2px] group-hover:bg-brand-primary/80 transition-colors duration-300 pointer-events-none" />

      {/* 3. Flèche vectorielle supérieure parfaitement nette et contrastée */}
      <ArrowUp className="relative z-10 w-5 h-5 text-white stroke-[2.5] group-hover:-translate-y-0.5 transition-transform duration-200 drop-shadow-md" />
    </button>
  );
};
