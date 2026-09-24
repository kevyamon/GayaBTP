import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, IProProfile } from '../types';
import { api, setAccessToken } from '../services/api';

interface AuthContextType {
  user: IUser | null;
  proProfile: IProProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserSession: (user: IUser, token: string, proProfile?: IProProfile) => void;
  updateUserProfile: (payload: Partial<IUser & { companyName?: string; specialties?: string[]; phoneWhatsApp?: string }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [proProfile, setProProfile] = useState<IProProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tentative de récupération de session au chargement initial via cookie HttpOnly
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.data) {
          setUser(data.data.user);
          setProProfile(data.data.proProfile || null);
        }
      } catch {
        setUser(null);
        setProProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const setUserSession = (newUser: IUser, token: string, newProProfile?: IProProfile) => {
    setAccessToken(token);
    setUser(newUser);
    if (newProProfile) setProProfile(newProProfile);
  };

  const updateUserProfile = async (
    payload: Partial<IUser & { companyName?: string; specialties?: string[]; phoneWhatsApp?: string }>
  ) => {
    const { data } = await api.patch('/auth/me', payload);
    if (data.success && data.data) {
      if (data.data.user) setUser(data.data.user);
      if (data.data.proProfile) setProProfile(data.data.proProfile);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success && data.data) {
      const token = data.data.accessToken || data.data.tokens?.accessToken || '';
      setUserSession(data.data.user, token, data.data.proProfile);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
      setProProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        proProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUserSession,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l intérieur d un AuthProvider');
  }
  return context;
};
