import { api } from './api';
import { IUser, IListing, ApiResponse, IPagination } from '../types';

export interface DashboardStats {
  totalUsers: number;
  totalPros: number;
  totalListings: number;
  pendingVerifications: number;
  pendingPayments: number;
  activeSubscriptions: number;
  totalRevenueFCFA: number;
  activeAlerts: number;
  totalJobs: number;
}

export interface AdminAuthResponse {
  user: IUser;
  accessToken: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  masterKey?: string;
  temporaryCode?: string;
}

export interface IAdminInvitation {
  _id: string;
  code: string;
  targetEmail?: string;
  createdBy: string;
  isUsed: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface IVerificationItem {
  _id: string;
  userId: IUser;
  proProfileId: {
    _id: string;
    companyName: string;
    accountType: string;
    specialties: string[];
  };
  idCardDocument?: { url: string; uploadedAt: string };
  businessLicenseDocument?: { url: string; uploadedAt: string };
  diplomaDocument?: { url: string; uploadedAt: string };
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
}

export interface IPaymentItem {
  _id: string;
  userId: IUser;
  planId: { _id: string; name: string; priceFCFA: number };
  amountFCFA: number;
  paymentMethod: string;
  transactionReference: string;
  status: 'pending' | 'verified' | 'failed';
  adminNotes?: string;
  createdAt: string;
}

export interface IAuditLogItem {
  _id: string;
  actor: { userId: string; email: string; role: string };
  action: string;
  resource: string;
  resourceId?: string;
  createdAt: string;
}

export const adminService = {
  async checkSetupStatus(): Promise<{ superAdminExists: boolean }> {
    const response = await api.get<ApiResponse<{ superAdminExists: boolean }>>(
      '/admin/auth/setup-status'
    );
    return response.data.data || { superAdminExists: true };
  },

  async login(payload: AdminLoginPayload): Promise<AdminAuthResponse> {
    const response = await api.post<ApiResponse<AdminAuthResponse>>(
      '/admin/auth/login',
      payload
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Identifiants administrateur incorrects.');
  },

  async register(payload: AdminRegisterPayload): Promise<AdminAuthResponse> {
    const response = await api.post<ApiResponse<AdminAuthResponse>>(
      '/admin/auth/register',
      payload
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Impossible de créer le compte administrateur.');
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return response.data.data || {
      totalUsers: 0,
      totalPros: 0,
      totalListings: 0,
      pendingVerifications: 0,
      pendingPayments: 0,
      activeSubscriptions: 0,
      totalRevenueFCFA: 0,
      activeAlerts: 0,
      totalJobs: 0,
    };
  },

  async getUsers(page = 1, limit = 20, search?: string, role?: string, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<IUser[]> & { pagination: IPagination }>(
      `/admin/users?${params.toString()}`
    );
    return {
      users: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async updateUserStatus(userId: string, status: string, reason?: string) {
    const response = await api.patch<ApiResponse<IUser>>(`/admin/users/${userId}/status`, {
      status,
      reason,
    });
    return response.data.data;
  },

  async updateUserRole(userId: string, role: string, reason?: string) {
    const response = await api.patch<ApiResponse<IUser>>(`/admin/users/${userId}/role`, {
      role,
      reason,
    });
    return response.data.data;
  },

  async banUser(userId: string, reason?: string) {
    const response = await api.post<ApiResponse<IUser>>(`/admin/users/${userId}/ban`, {
      reason,
    });
    return response.data.data;
  },

  async getListings(page = 1, limit = 20, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<IListing[]> & { pagination: IPagination }>(
      `/admin/listings?${params.toString()}`
    );
    return {
      listings: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async moderateListing(listingId: string, status: string) {
    const response = await api.patch<ApiResponse<IListing>>(
      `/admin/listings/${listingId}/moderate`,
      { status }
    );
    return response.data.data;
  },

  async getPayments(page = 1, limit = 20, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<IPaymentItem[]> & { pagination: IPagination }>(
      `/admin/payments?${params.toString()}`
    );
    return {
      payments: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async getVerifications(page = 1, limit = 20, status?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);

    const response = await api.get<ApiResponse<IVerificationItem[]> & { pagination: IPagination }>(
      `/admin/verifications?${params.toString()}`
    );
    return {
      verifications: response.data.data || [],
      pagination: response.data.pagination,
    };
  },

  async reviewVerification(requestId: string, action: 'approve' | 'reject', notes?: string) {
    const response = await api.post<ApiResponse<IVerificationItem>>(
      `/admin/verifications/${requestId}/review`,
      { action, notes }
    );
    return response.data.data;
  },

  async createInvitation(targetEmail?: string): Promise<IAdminInvitation> {
    const response = await api.post<ApiResponse<IAdminInvitation>>(
      '/admin/admins/invite',
      { targetEmail }
    );
    return response.data.data!;
  },

  async getAuditLogs(page = 1, limit = 30) {
    const response = await api.get<ApiResponse<IAuditLogItem[]> & { pagination: IPagination }>(
      `/admin/logs?page=${page}&limit=${limit}`
    );
    return {
      logs: response.data.data || [],
      pagination: response.data.pagination,
    };
  },
};
