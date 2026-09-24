import { api } from './api';
import { ApiResponse, IListing } from '../types';

export interface IPublicUserProfile {
  user: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    avatar?: string;
    coverImage?: string;
    city?: string;
    bio?: string;
    createdAt?: string;
  };
  proProfile?: {
    companyName?: string;
    specialties?: string[];
    isVerified?: boolean;
    yearsOfExperience?: number;
    ratingAverage?: number;
  };
  listings: IListing[];
}

const MOCK_PROFILES: Record<string, IPublicUserProfile> = {
  'usr-001': {
    user: {
      _id: 'usr-001',
      name: 'Koffi Emmanuel Kouassi',
      email: 'emmanuel.kouassi@gayabtp.ci',
      phone: '+225 07 00 00 00 01',
      role: 'professionnel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
      city: 'Abidjan (Bingerville)',
      bio: 'Promoteur foncier agréé & expert en viabilisation de parcelles avec ACD et CMP. Plus de 12 ans d’expérience sur le marché immobilier ivoirien.',
      createdAt: '2023-04-15T00:00:00.000Z',
    },
    proProfile: {
      companyName: 'Kouassi Foncier & BTP International',
      specialties: ['Aménagement Foncier', 'Génie Civil', 'Suivi de Chantier'],
      isVerified: true,
      yearsOfExperience: 12,
      ratingAverage: 4.9,
    },
    listings: [],
  },
  'usr-002': {
    user: {
      _id: 'usr-002',
      name: 'Aïssata Traoré',
      email: 'aissata.traore@gayabtp.ci',
      phone: '+225 05 00 00 00 02',
      role: 'professionnel',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      city: 'Abidjan (Cocody)',
      bio: 'Mandataire agréée et directrice de cabinet conseil immobilier. Spécialiste des grands domaines et parcelles commerciales à fort potentiel.',
      createdAt: '2024-01-10T00:00:00.000Z',
    },
    proProfile: {
      companyName: 'Ivoire Foncier Conseil',
      specialties: ['Conseil Juridique Foncier', 'Transactions Commerciales'],
      isVerified: true,
      yearsOfExperience: 8,
      ratingAverage: 4.8,
    },
    listings: [],
  },
  'usr-003': {
    user: {
      _id: 'usr-003',
      name: 'Jean-Marc Dago',
      email: 'jeanmarc.dago@gayabtp.ci',
      phone: '+225 01 00 00 00 03',
      role: 'particulier',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      city: 'Grand-Bassam',
      bio: 'Propriétaire particulier. Cession directe de parcelles familiales avec documents notariés certifiés.',
      createdAt: '2025-02-20T00:00:00.000Z',
    },
    listings: [],
  },
};

export const userService = {
  async getPublicProfile(id: string): Promise<IPublicUserProfile | null> {
    try {
      const response = await api.get<ApiResponse<IPublicUserProfile>>(`/users/${id}/public-profile`, {
        timeout: 2500,
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Mode résilience locale si API déconnectée
    }

    if (MOCK_PROFILES[id]) {
      return MOCK_PROFILES[id];
    }

    // Profil générique de secours
    return {
      user: {
        _id: id,
        name: 'Propriétaire GayaBTP',
        phone: '+225 07 00 00 00 00',
        role: 'particulier',
        avatar: undefined,
        coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
        city: 'Abidjan',
        bio: 'Utilisateur actif sur la plateforme GayaBTP.',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      listings: [],
    };
  },
};
