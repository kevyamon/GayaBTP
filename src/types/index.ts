export type UserRole = 'particulier' | 'professionnel' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface IProServiceItem {
  title: string;
  indicativePriceFCFA?: number;
  unit?: string;
  description?: string;
}

export interface IProProjectItem {
  title: string;
  location: string;
  year?: number;
  imageUrl: string;
  description?: string;
}

export interface IProProfile {
  _id: string;
  userId: string;
  accountType: 'artisan' | 'entreprise';
  companyName: string;
  specialties: string[];
  city: string;
  district?: string;
  phoneWhatsApp?: string;
  phoneCall?: string;
  email?: string;
  bio?: string;
  yearsOfExperience?: number;
  isVerified: boolean;
  verificationStatus: 'not_requested' | 'pending' | 'verified' | 'rejected';
  hasProBadge: boolean;
  avatarUrl?: string;
  coverUrl?: string;
  completedProjectsCount?: number;
  services?: IProServiceItem[];
  portfolio?: IProProjectItem[];
}

export type PropertyType = 'terrain' | 'maison' | 'appartement' | 'immeuble' | 'commercial';
export type TransactionType = 'vente' | 'location';
export type LandTitleType = 'ACD' | 'CMP' | 'approbation' | 'bail_emphytéotique' | 'autre';
export type ListingStatus = 'published' | 'pending' | 'rejected' | 'sold';

export interface IListing {
  _id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  priceFCFA: number;
  surfaceM2: number;
  city: string;
  district?: string;
  neighborhood?: string;
  titleType: LandTitleType;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  images: string[];
  contactPhone: string;
  contactWhatsApp?: string;
  status: ListingStatus;
  userId: string;
  createdAt: string;
}

export interface IPortal {
  id: string;
  name: string;
  officialEntity: string;
  url: string;
  description: string;
  features: string[];
  badgeText: string;
  isOfficialState: boolean;
}

export interface IAlert {
  _id: string;
  label: string;
  propertyType: PropertyType;
  city: string;
  district?: string;
  maxPriceFCFA?: number;
  minSurfaceM2?: number;
  titleType?: LandTitleType;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}
