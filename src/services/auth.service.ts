import { api, setAccessToken } from './api';
import { IUser, IProProfile, ApiResponse } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterParticulierPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterProPayload {
  name: string;
  email: string;
  password: string;
  category: string;
  accountType?: string;
  companyName: string;
  specialties: string[];
  city: string;
  district?: string;
  phoneWhatsApp: string;
  bio?: string;
  yearsOfExperience?: number;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthSuccessData {
  user: IUser;
  proProfile?: IProProfile;
  tokens: {
    accessToken: string;
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSuccessData> {
    try {
      const response = await api.post<ApiResponse<AuthSuccessData>>('/auth/login', payload);
      if (response.data.success && response.data.data) {
        setAccessToken(response.data.data.tokens.accessToken);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Identifiants de connexion invalides.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message || error.message || 'Échec de connexion au serveur.'
      );
    }
  },

  async loginWithGoogle(idToken: string): Promise<AuthSuccessData> {
    try {
      const response = await api.post<ApiResponse<AuthSuccessData>>('/auth/google', {
        idToken,
      });
      if (response.data.success && response.data.data) {
        setAccessToken(response.data.data.tokens.accessToken);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Échec de l’authentification avec Google.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message || error.message || 'Connexion Google impossible.'
      );
    }
  },

  async registerParticulier(payload: RegisterParticulierPayload): Promise<AuthSuccessData> {
    try {
      const response = await api.post<ApiResponse<AuthSuccessData>>(
        '/auth/register/particulier',
        payload
      );
      if (response.data.success && response.data.data) {
        setAccessToken(response.data.data.tokens.accessToken);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Impossible de créer votre compte particulier.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message || error.message || 'Erreur lors de la création du compte.'
      );
    }
  },

  async registerPro(payload: RegisterProPayload): Promise<AuthSuccessData> {
    try {
      const response = await api.post<ApiResponse<AuthSuccessData>>('/auth/register/pro', payload);
      if (response.data.success && response.data.data) {
        setAccessToken(response.data.data.tokens.accessToken);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Impossible de créer votre compte professionnel.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Erreur lors de l’enregistrement professionnel.'
      );
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/forgot-password', payload);
      return (
        response.data.message ||
        'Si cette adresse est enregistrée, un e-mail avec votre code OTP vous a été envoyé.'
      );
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Impossible d’envoyer le code de réinitialisation.'
      );
    }
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    try {
      const response = await api.post<ApiResponse<null>>('/auth/reset-password', payload);
      return (
        response.data.message ||
        'Votre mot de passe a été modifié avec succès. Vous pouvez vous connecter.'
      );
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Code de sécurité invalide ou expiré.'
      );
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async getMe(): Promise<{ user: IUser; proProfile?: IProProfile } | null> {
    try {
      const response = await api.get<ApiResponse<{ user: IUser; proProfile?: IProProfile }>>(
        '/auth/me'
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};
