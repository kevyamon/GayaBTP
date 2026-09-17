import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 lg:pt-16 pb-24 lg:pb-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête Compact Mobile & Présentation Desktop */}
        <div className="flex flex-col lg:hidden pb-6 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="GayaBTP Logo" className="h-9 w-auto object-contain" />
              <span className="font-title text-xl text-white tracking-wide">
                Gaya<span className="text-brand-primary">BTP</span>
              </span>
            </Link>

            {/* Bouton pour déplier/replier sur mobile */}
            <button
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-brand text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
              aria-label={isMobileExpanded ? 'Replier le pied de page' : 'Déplier le pied de page'}
            >
              <span>{isMobileExpanded ? 'Masquer les rubriques' : 'Toutes les rubriques'}</span>
              {isMobileExpanded ? <ChevronDown className="w-4 h-4 text-brand-primary" /> : <ChevronUp className="w-4 h-4 text-brand-primary" />}
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Plateforme nationale de référence pour sécuriser vos terrains, actes fonciers et professionnels du BTP en Côte d’Ivoire.
          </p>
        </div>

        {/* Grille des Colonnes (Toujours visible sur desktop, accordéon sur mobile) */}
        <div className={`pt-6 lg:pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800 ${isMobileExpanded ? 'grid' : 'hidden lg:grid'}`}>
          
          {/* Colonne 1 & 2 : Présentation Desktop */}
          <div className="hidden lg:block lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="GayaBTP Logo" className="h-10 w-auto object-contain" />
              <span className="font-title text-2xl text-white tracking-wide">
                Gaya<span className="text-brand-primary">BTP</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Plateforme nationale de référence en République de Côte d’Ivoire. Nous sécurisons l’accès à la propriété foncière, certifions les professionnels du BTP et orientons vers les registres étatiques officiels.
            </p>
          </div>

          {/* Colonne 3 : Foncier & Biens */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-primary">
              Foncier & Biens
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/annonces?titleType=ACD" className="hover:text-white transition-colors">
                  Terrains avec ACD
                </Link>
              </li>
              <li>
                <Link to="/annonces?titleType=CMP" className="hover:text-white transition-colors">
                  Parcelles avec CMP
                </Link>
              </li>
              <li>
                <Link to="/annonces?city=Abidjan" className="hover:text-white transition-colors">
                  Offres à Abidjan & Grand Abidjan
                </Link>
              </li>
              <li>
                <Link to="/calculateur" className="hover:text-white transition-colors">
                  Simulateur de Frais Notariés
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Écosystème BTP & Hub État */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-primary">
              Écosystème BTP
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/verification" className="hover:text-white transition-colors">
                  Hub Portails Étatiques (IDUFCI / DGI)
                </Link>
              </li>
              <li>
                <Link to="/pros" className="hover:text-white transition-colors">
                  Artisans & Bureaux Vérifiés
                </Link>
              </li>
              <li>
                <Link to="/emplois" className="hover:text-white transition-colors">
                  Bourse de l’Emploi & Stages BTP
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Guides Juridiques Fonciers
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 5 : Coordonnées & Siège */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-primary">
              Contact & Siège
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                <span>Abidjan, Cocody Riviera — Côte d’Ivoire</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-accent shrink-0" />
                <span>+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>contact@gayabtp.ci</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Note de Transparence Juridique & Mentions */}
        <div className="pt-6 lg:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center md:text-left leading-relaxed max-w-2xl">
            <strong>Avertissement légal :</strong> GayaBTP est une plateforme numérique d’information, d’orientation et de mise en relation. Elle ne se substitue en aucun cas aux compétences régaliennes des Conservations Foncières, du Ministère de la Construction ou des Notaires assermentés de Côte d’Ivoire.
          </p>
          <p className="shrink-0 font-medium">
            © {new Date().getFullYear()} GayaBTP. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
