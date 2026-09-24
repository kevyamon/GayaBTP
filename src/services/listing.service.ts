import { api } from './api';
import { IListing, ApiResponse, PropertyType, LandTitleType } from '../types';
import { MOCK_LISTINGS } from './mockListings.data';

export { MOCK_LISTINGS };

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

let inMemoryListings: IListing[] = [...MOCK_LISTINGS];

function filterListingsArray(items: IListing[], params?: ListingFilterParams): IListing[] {
  if (!params) return items;
  let results = [...items];

  if (params.propertyType) {
    results = results.filter((item) => item.propertyType === params.propertyType);
  }
  if (params.city) {
    results = results.filter((item) => item.city.toLowerCase() === params.city!.toLowerCase());
  }
  if (params.district) {
    results = results.filter((item) => item.district?.toLowerCase() === params.district!.toLowerCase());
  }
  if (params.titleType) {
    results = results.filter((item) => item.titleType === params.titleType);
  }
  if (params.maxPrice) {
    results = results.filter((item) => item.priceFCFA <= params.maxPrice!);
  }
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        (item.district && item.district.toLowerCase().includes(q))
    );
  }
  if (params.sort) {
    if (params.sort === 'price_asc') results.sort((a, b) => a.priceFCFA - b.priceFCFA);
    if (params.sort === 'price_desc') results.sort((a, b) => b.priceFCFA - a.priceFCFA);
    if (params.sort === 'surface_desc') results.sort((a, b) => b.surfaceM2 - a.surfaceM2);
  }
  if (params.limit) {
    results = results.slice(0, params.limit);
  }
  return results;
}

export const listingService = {
  getCachedListings(params?: ListingFilterParams): IListing[] {
    return filterListingsArray(inMemoryListings, params);
  },

  async getListings(params?: ListingFilterParams): Promise<{ listings: IListing[]; total: number }> {
    try {
      const response = await api.get<ApiResponse<IListing[]>>('/listings', { params, timeout: 2000 });
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        inMemoryListings = response.data.data;
        const filtered = filterListingsArray(inMemoryListings, params);
        return {
          listings: filtered,
          total: response.data.pagination?.total || filtered.length,
        };
      }
    } catch {
      // Mode résilience immédiat
    }
    const filtered = filterListingsArray(inMemoryListings, params);
    return { listings: filtered, total: filtered.length };
  },

  async getListingById(id: string): Promise<IListing | null> {
    const local = inMemoryListings.find((l) => l._id === id);
    if (local) return local;
    try {
      const response = await api.get<ApiResponse<IListing>>(`/listings/${id}`, { timeout: 2000 });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Mode résilience
    }
    return MOCK_LISTINGS.find((l) => l._id === id) || null;
  },

  async createListing(payload: {
    title: string;
    description: string;
    propertyType: PropertyType;
    transactionType: 'vente' | 'location';
    priceFCFA: number;
    surfaceM2: number;
    city: string;
    district: string;
    address: string;
    titleType: LandTitleType;
    titleNumber: string;
    photos: string[];
    hasWater?: boolean;
    hasElectricity?: boolean;
    hasRoadAccess?: boolean;
    isFenced?: boolean;
    contactName: string;
    phoneCall: string;
    phoneWhatsApp: string;
    latitude?: number;
    longitude?: number;
  }): Promise<IListing> {
    const newListing: IListing = {
      _id: `lst-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      propertyType: payload.propertyType,
      transactionType: payload.transactionType,
      priceFCFA: payload.priceFCFA,
      surfaceM2: payload.surfaceM2,
      city: payload.city,
      district: payload.district,
      titleType: payload.titleType,
      coordinates:
        payload.latitude && payload.longitude
          ? { latitude: payload.latitude, longitude: payload.longitude }
          : undefined,
      images:
        payload.photos.length > 0
          ? payload.photos
          : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
      contactPhone: payload.phoneCall,
      contactWhatsApp: payload.phoneWhatsApp,
      status: 'published',
      userId: 'usr-current',
      createdAt: new Date().toISOString(),
    };
    inMemoryListings = [newListing, ...inMemoryListings];
    return newListing;
  },

  async getMyListings(): Promise<IListing[]> {
    try {
      const response = await api.get<ApiResponse<IListing[]>>('/listings/my/listings');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch {
      // Mode résilience
    }
    return inMemoryListings;
  },

  async updateListing(id: string, payload: Partial<IListing>): Promise<IListing> {
    try {
      const response = await api.patch<ApiResponse<IListing>>(`/listings/${id}`, payload);
      if (response.data.success && response.data.data) {
        const updated = response.data.data;
        inMemoryListings = inMemoryListings.map((l) => (l._id === id ? { ...l, ...updated } : l));
        return updated;
      }
    } catch {
      // Mode résilience locale
    }
    inMemoryListings = inMemoryListings.map((l) => (l._id === id ? { ...l, ...payload } : l));
    return inMemoryListings.find((l) => l._id === id)!;
  },

  async deleteListing(id: string): Promise<boolean> {
    try {
      await api.delete(`/listings/${id}`);
    } catch {
      // Mode résilience locale
    }
    inMemoryListings = inMemoryListings.filter((l) => l._id !== id);
    return true;
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
      const response = await api.post('/alerts', payload, { timeout: 3000 });
      return response.data.success;
    } catch {
      return true; // Mode résilience
    }
  },
};
