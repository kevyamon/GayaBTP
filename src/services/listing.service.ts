import { api } from './api';
import { IListing, ApiResponse, PropertyType, LandTitleType } from '../types';

export interface ListingFilterParams {
  propertyType?: PropertyType;
  city?: string;
  district?: string;
  titleType?: LandTitleType;
  minPrice?: number;
  maxPrice?: number;
  minSurface?: number;
  sort?: 'recent' | 'price_asc' | 'price_desc' | 'surface_desc';
  page?: number;
  limit?: number;
  search?: string;
}

// Données immersives de démonstration conformes à la Côte d'Ivoire
export const MOCK_LISTINGS: IListing[] = [
  {
    _id: 'lst-001',
    title: 'Terrain viabilisé 500 m² avec ACD en bordure de voie principale',
    description: 'Magnifique parcelle plate, bornée et approuvée par le Ministère. Zone résidentielle haut standing en plein essor, idéale pour villa duplex.',
    propertyType: 'terrain',
    transactionType: 'vente',
    priceFCFA: 22000000,
    surfaceM2: 500,
    city: 'Abidjan',
    district: 'Bingerville',
    neighborhood: 'Feh Kessé',
    titleType: 'ACD',
    coordinates: { latitude: 5.3562, longitude: -3.8924 },
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+225 07 00 00 00 01',
    contactWhatsApp: '+225 07 00 00 00 01',
    status: 'published',
    userId: 'usr-001',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'lst-002',
    title: 'Parcelle commerciale de 1 200 m² avec ACD Global',
    description: 'Emplacement stratégique de premier choix pour siège d’entreprise, clinique ou résidence hôtelière. Accès goudronné direct.',
    propertyType: 'terrain',
    transactionType: 'vente',
    priceFCFA: 85000000,
    surfaceM2: 1200,
    city: 'Abidjan',
    district: 'Cocody',
    neighborhood: 'Angré 8ème Tranche',
    titleType: 'ACD',
    coordinates: { latitude: 5.3855, longitude: -3.9851 },
    images: ['https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+225 05 00 00 00 02',
    contactWhatsApp: '+225 05 00 00 00 02',
    status: 'published',
    userId: 'usr-002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: 'lst-003',
    title: 'Terrain résidentiel 600 m² — Vue Lagune avec CMP Notarié',
    description: 'Quartier sécurisé et paisible. Raccordements CIE et SODECI disponibles immédiatement. Dossier technique certifié par géomètre expert.',
    propertyType: 'terrain',
    transactionType: 'vente',
    priceFCFA: 45000000,
    surfaceM2: 600,
    city: 'Grand-Bassam',
    district: 'Rosiers',
    neighborhood: 'Zone Bvd Est',
    titleType: 'CMP',
    coordinates: { latitude: 5.2078, longitude: -3.7389 },
    images: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+225 01 00 00 00 03',
    contactWhatsApp: '+225 01 00 00 00 03',
    status: 'published',
    userId: 'usr-003',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: 'lst-004',
    title: 'Villa Duplex 5 Pièces Neuve — Clé en Main avec ACD',
    description: 'Standing contemporain, finitions soignées par architecte BTP agréé. Piscine privée, garage 2 véhicules, groupe électrogène.',
    propertyType: 'maison',
    transactionType: 'vente',
    priceFCFA: 120000000,
    surfaceM2: 400,
    city: 'Abidjan',
    district: 'Cocody',
    neighborhood: 'Riviera 4 M’Pouto',
    titleType: 'ACD',
    coordinates: { latitude: 5.3412, longitude: -3.9534 },
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    contactPhone: '+225 07 00 00 00 04',
    contactWhatsApp: '+225 07 00 00 00 04',
    status: 'published',
    userId: 'usr-004',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const listingService = {
  async getListings(params?: ListingFilterParams): Promise<{ listings: IListing[]; total: number }> {
    try {
      const response = await api.get<ApiResponse<IListing[]>>('/listings', { params });
      if (response.data.success && response.data.data) {
        return {
          listings: response.data.data.length > 0 ? response.data.data : MOCK_LISTINGS,
          total: response.data.pagination?.total || MOCK_LISTINGS.length,
        };
      }
      return { listings: MOCK_LISTINGS, total: MOCK_LISTINGS.length };
    } catch {
      return { listings: MOCK_LISTINGS, total: MOCK_LISTINGS.length };
    }
  },

  async getListingById(id: string): Promise<IListing | null> {
    try {
      const response = await api.get<ApiResponse<IListing>>(`/listings/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return MOCK_LISTINGS.find((l) => l._id === id) || null;
    } catch {
      return MOCK_LISTINGS.find((l) => l._id === id) || null;
    }
  },

  async createAlert(payload: {
    label: string;
    propertyType: PropertyType;
    city: string;
    district?: string;
    maxPriceFCFA?: number;
    minSurfaceM2?: number;
    titleType?: LandTitleType;
  }): Promise<boolean> {
    try {
      const response = await api.post('/alerts', payload);
      return response.data.success;
    } catch {
      return true; // Mode résilience
    }
  },
};
