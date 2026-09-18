import { api } from './api';
import { IProProfile, ApiResponse } from '../types';

export interface ProFilterParams {
  specialty?: string;
  city?: string;
  accountType?: 'artisan' | 'entreprise';
  verifiedOnly?: boolean;
  search?: string;
}

export const MOCK_PROS: IProProfile[] = [
  {
    _id: 'pro-001',
    userId: 'usr-p01',
    accountType: 'entreprise',
    companyName: 'Cabinet Géomètre-Expert Kouamé & Associés',
    specialties: ['Géomètre-Expert', 'Bornage & Topographie', 'Assistance ACD'],
    city: 'Abidjan',
    district: 'Cocody',
    phoneWhatsApp: '+225 07 01 02 03 04',
    phoneCall: '+225 07 01 02 03 04',
    email: 'contact@cabinet-kouame-geometre.ci',
    bio: 'Cabinet agréé OGECI spécialisé dans le bornage contradictoire, les états des lieux parcellaires, le lever topographique et la constitution des dossiers techniques d’immatriculation foncière.',
    yearsOfExperience: 14,
    isVerified: true,
    verificationStatus: 'verified',
    hasProBadge: true,
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=1000&q=80',
    completedProjectsCount: 180,
    services: [
      {
        title: 'Bornage contradictoire de parcelle',
        indicativePriceFCFA: 350000,
        unit: 'par lot',
        description: 'Pose des bornes officielles avec procès-verbal signé des riverains et visa géomètre.',
      },
      {
        title: 'Lever topographique & plan de situation',
        indicativePriceFCFA: 200000,
        unit: 'par parcelle',
        description: 'Relevé géoréférencé IDUFCI aux normes cadastrales du Ministère de la Construction.',
      },
      {
        title: 'Expertise & vérification de limites foncières',
        indicativePriceFCFA: 150000,
        unit: 'sur consultation',
        description: 'Audit technique sur site pour prévenir les conflits de mitoyenneté et chevauchements.',
      },
    ],
    portfolio: [
      {
        title: 'Délimitation & bornage de lotissement 45 lots',
        location: 'Bingerville — Feh Kessé',
        year: 2025,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        description: 'Implantation et géoréférencement complet de 45 parcelles résidentielles viabilisées.',
      },
      {
        title: 'Plan cadastral pour complexe commercial',
        location: 'Cocody — Angré 9ème Tranche',
        year: 2024,
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        description: 'Dossier technique d’approbation déposé auprès de la Conservation Foncière DGI.',
      },
    ],
  },
  {
    _id: 'pro-002',
    userId: 'usr-p02',
    accountType: 'entreprise',
    companyName: 'Atelier d’Architecture & BTP Ivoire Concept',
    specialties: ['Architecte', 'Plans 3D & Permis de Construire', 'Suivi de Chantier'],
    city: 'Abidjan',
    district: 'Plateau',
    phoneWhatsApp: '+225 05 11 22 33 44',
    phoneCall: '+225 05 11 22 33 44',
    email: 'contact@ivoireconcept-archi.ci',
    bio: 'Agence d’architecture inscrite à l’Ordre National des Architectes de Côte d’Ivoire (CNOA). Conception bioclimatique de villas modernes, immeubles R+4 et suivi rigoureux d’exécution des travaux.',
    yearsOfExperience: 10,
    isVerified: true,
    verificationStatus: 'verified',
    hasProBadge: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    completedProjectsCount: 65,
    services: [
      {
        title: 'Conception de plan de villa & dossier Permis de Construire',
        indicativePriceFCFA: 1800000,
        unit: 'forfait dossier',
        description: 'Plans 2D/3D cotés, notices de sécurité et dépôt au Guichet Unique MCLU.',
      },
      {
        title: 'Mission complète de maîtrise d’œuvre & suivi',
        indicativePriceFCFA: 450000,
        unit: 'par mois de chantier',
        description: 'Contrôle hebdomadaire de la conformité des armatures, du béton et des finitions.',
      },
    ],
    portfolio: [
      {
        title: 'Villa Duplex Contemporaine R+1 avec piscine',
        location: 'Grand-Bassam — Quartier France',
        year: 2024,
        imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        description: 'Projet résidentiel éco-responsable alliant ventilation naturelle et matériaux locaux.',
      },
    ],
  },
  {
    _id: 'pro-003',
    userId: 'usr-p03',
    accountType: 'entreprise',
    companyName: 'BTP Structure & VRD Sud',
    specialties: ['Gros Œuvre & VRD', 'Terrassement & Fondations', 'Béton Armé'],
    city: 'Abidjan',
    district: 'Yopougon',
    phoneWhatsApp: '+225 01 44 55 66 77',
    phoneCall: '+225 01 44 55 66 77',
    email: 'devis@btp-structure-vrd.ci',
    bio: 'Entreprise générale de génie civil disposant d’un parc d’engins lourds. Réalisation de fondations spéciales, dallages industriels, assainissement et voiries.',
    yearsOfExperience: 16,
    isVerified: true,
    verificationStatus: 'verified',
    hasProBadge: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
    completedProjectsCount: 110,
    services: [
      {
        title: 'Terrassement mécanique & décapage de terrain',
        indicativePriceFCFA: 600000,
        unit: 'par parcelle de 500 m²',
        description: 'Nivellement au laser, évacuation des déblais et compactage de plateforme.',
      },
      {
        title: 'Coulage de semelles & longrines béton armé',
        indicativePriceFCFA: 85000,
        unit: 'par m³ dosé à 350 kg',
        description: 'Fourniture et mise en œuvre certifiée avec contrôle de résistance éprouvettes.',
      },
    ],
    portfolio: [
      {
        title: 'Plateforme logistique et voirie lourde',
        location: 'San-Pédro — Zone Industrielle',
        year: 2024,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=600&q=80',
        description: 'Aménagement de 4 000 m² de voiries pavées et caniveaux d’évacuation.',
      },
    ],
  },
  {
    _id: 'pro-004',
    userId: 'usr-p04',
    accountType: 'artisan',
    companyName: 'Élec & Fluides Sécurisés — Maître Artisan Touré',
    specialties: ['Électricité Bâtiment', 'Plomberie & Sanitaire', 'Énergie Solaire'],
    city: 'Abidjan',
    district: 'Marcory',
    phoneWhatsApp: '+225 07 88 99 00 11',
    phoneCall: '+225 07 88 99 00 11',
    email: 'toure.electricite@gmail.com',
    bio: 'Artisan électricien diplômé du Lycée Technique d’Abidjan (LTA). Tableaux conformes aux normes CIE, mise à la terre sécurisée et installations solaires autonomes.',
    yearsOfExperience: 8,
    isVerified: true,
    verificationStatus: 'verified',
    hasProBadge: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    completedProjectsCount: 95,
    services: [
      {
        title: 'Câblage complet & tableau électrique pour villa',
        indicativePriceFCFA: 750000,
        unit: 'forfait main d’œuvre',
        description: 'Tirage de lignes, pose des disjoncteurs différentiels et attestation de conformité.',
      },
    ],
    portfolio: [],
  },
];

export const proService = {
  async getPros(params?: ProFilterParams): Promise<IProProfile[]> {
    try {
      const response = await api.get<ApiResponse<IProProfile[]>>('/pros', { params });
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      }
      return filterMockPros(params);
    } catch {
      return filterMockPros(params);
    }
  },

  async getProById(id: string): Promise<IProProfile | null> {
    try {
      const response = await api.get<ApiResponse<IProProfile>>(`/pros/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return MOCK_PROS.find((p) => p._id === id) || null;
    } catch {
      return MOCK_PROS.find((p) => p._id === id) || null;
    }
  },
};

function filterMockPros(params?: ProFilterParams): IProProfile[] {
  if (!params) return MOCK_PROS;
  let results = [...MOCK_PROS];

  if (params.specialty && params.specialty !== 'all') {
    results = results.filter((p) =>
      p.specialties.some((s) => s.toLowerCase().includes(params.specialty!.toLowerCase()))
    );
  }

  if (params.city && params.city !== 'all') {
    results = results.filter((p) => p.city.toLowerCase() === params.city!.toLowerCase());
  }

  if (params.accountType && params.accountType !== ('all' as any)) {
    results = results.filter((p) => p.accountType === params.accountType);
  }

  if (params.verifiedOnly) {
    results = results.filter((p) => p.isVerified);
  }

  if (params.search && params.search.trim()) {
    const query = params.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.companyName.toLowerCase().includes(query) ||
        (p.bio && p.bio.toLowerCase().includes(query)) ||
        p.specialties.some((s) => s.toLowerCase().includes(query))
    );
  }

  return results;
}
