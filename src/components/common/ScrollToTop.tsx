import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Réinitialisation instantanée du défilement au sommet de la page
 * lors de toute transition de route (expérience applicative native).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};
