import { IPortal } from '../types';

export const OFFICIAL_PORTALS: IPortal[] = [
  {
    id: 'idufci',
    name: 'Identifiant Unique du Foncier de Côte d’Ivoire (IDUFCI)',
    officialEntity: 'Ministère du Budget et du Portefeuille de l’État & MCLU',
    url: 'https://idufci.dgi.gouv.ci',
    description: 'Système national d immatriculation numérique et de géolocalisation certifiée de chaque parcelle sur le territoire ivoirien.',
    features: [
      'Vérification du numéro IDUFCI officiel d une parcelle',
      'Consultation des limites cadastrales numérisées',
      'Vérification de la concordance du plan de situation',
    ],
    badgeText: 'Plateforme d’État',
    isOfficialState: true,
  },
  {
    id: 'dgi-livre-foncier',
    name: 'Livre Foncier Électronique (Conservation Foncière DGI)',
    officialEntity: 'Direction Générale des Impôts (DGI)',
    url: 'https://e-conservation.dgi.gouv.ci',
    description: 'Registre public officiel des droits réels immobiliers, hypothèques, servitudes et mutations de propriété enregistrées en Côte d’Ivoire.',
    features: [
      'Demande d état des droits réels et charges grevant le bien',
      'Vérification du nom du propriétaire légitime inscrit',
      'Confirmation de la validité du CMP ou de l inscription du titre',
    ],
    badgeText: 'Conservation Foncière',
    isOfficialState: true,
  },
  {
    id: 'mclu-guichet-unique',
    name: 'Guichet Unique du Foncier et de l’Habitat (MCLU)',
    officialEntity: 'Ministère de la Construction, du Logement et de l’Urbanisme',
    url: 'https://construction.gouv.ci',
    description: 'Portail officiel d instruction et de délivrance de l Arrêté de Concession Définitive (ACD) et du Permis de Construire.',
    features: [
      'Suivi en ligne de l avancement d un dossier d ACD',
      'Vérification de l authenticité de l arrêté d approbation d un lotissement',
      'Consultation du Plan d Urbanisme Directeur (PUD)',
    ],
    badgeText: 'Ministère Tutelle',
    isOfficialState: true,
  },
  {
    id: 'ogeci',
    name: 'Ordre des Géomètres Experts de Côte d’Ivoire (OGECI)',
    officialEntity: 'Ordre National des Géomètres Experts',
    url: 'https://ogeci.ci',
    description: 'Annuaire officiel et tableau de l Ordre pour identifier les géomètres experts assermentés habilités au bornage contradictoire.',
    features: [
      'Vérification de l inscription au tableau de l Ordre',
      'Attestation de régularité des travaux topographiques',
      'Sécurisation des dossiers techniques de délimitation',
    ],
    badgeText: 'Ordre Professionnel',
    isOfficialState: false,
  },
];

export const portalService = {
  async getPortals(): Promise<IPortal[]> {
    return OFFICIAL_PORTALS;
  },
};
