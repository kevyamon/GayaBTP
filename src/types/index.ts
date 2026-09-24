export type UserRole = 'particulier' | 'professionnel' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  city?: string;
  bio?: string;
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
  verificationStatus: 'not_requested' | 'pending' | 'verified' | 'rejected' | 'approved';
  hasProBadge: boolean;
  subscriptionPlan?: string;
  avatarUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  completedProjectsCount?: number;
  services?: IProServiceItem[];
  portfolio?: IProProjectItem[];
}

export type PropertyType =
  | 'terrain'
  | 'terrain_nu'
  | 'terrain_villageois'
  | 'maison'
  | 'villa'
  | 'cite'
  | 'appartement'
  | 'immeuble'
  | 'commercial'
  | 'commerce';

export type TransactionType = 'vente' | 'location';

export type LandTitleType =
  | 'ACD'
  | 'CMP'
  | 'approbation'
  | 'arrete_concession'
  | 'lettre_attribution'
  | 'bail_emphytéotique'
  | 'autre';

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'rejected'
  | 'suspended'
  | 'archived'
  | 'active'
  | 'pending'
  | 'sold';

export interface IListingOwner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface IListing {
  _id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType?: TransactionType;
  priceFCFA: number;
  surfaceM2: number;
  city: string;
  district?: string;
  neighborhood?: string;
  titleType: LandTitleType;
  coordinates?: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
  images: string[];
  contactPhone?: string;
  contactWhatsApp?: string;
  status: ListingStatus;
  userId?: string;
  ownerId?: string | IListingOwner;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
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

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: IPagination;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

