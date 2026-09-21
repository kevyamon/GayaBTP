import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IUser } from '../types';
import {
  adminService,
  AdminLoginPayload,
  AdminRegisterPayload,
} from '../services/admin.service';
import { setAccessToken } from '../services/api';
import { clientSocketService } from '../services/socket.service';

interface AdminAuthContextType {
  adminUser: IUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  loginAdmin: (payload: AdminLoginPayload) => Promise<void>;
  registerAdmin: (payload: AdminRegisterPayload) => Promise<void>;
  logoutAdmin: () => void;
}

const ADMIN_STORAGE_KEY = 'gayabtp_admin_session';
const ADMIN_TOKEN_KEY = 'gayabtp_admin_token';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<IUser | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Synchronisation de la connexion Socket.IO et des en-têtes Axios
  useEffect(() => {
    if (adminToken && adminUser?.role === 'admin') {
      setAccessToken(adminToken);
      clientSocketService.connect(adminToken);
    }
  }, [adminToken, adminUser]);

  const setAdminSession = useCallback((user: IUser, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    setAccessToken(token);
    clientSocketService.connect(token);
  }, []);

  const loginAdmin = async (payload: AdminLoginPayload): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await adminService.login(payload);
      if (data.user.role !== 'admin') {
        throw new Error('Accès réservé exclusivement aux administrateurs.');
      }
      setAdminSession(data.user, data.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (payload: AdminRegisterPayload): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await adminService.register(payload);
      setAdminSession(data.user, data.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = useCallback(() => {
    setAdminUser(null);
    setAdminToken(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAccessToken(null);
    clientSocketService.disconnect();
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAdminAuthenticated: Boolean(adminToken && adminUser?.role === 'admin'),
        isLoading,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth doit être utilisé au sein d’un AdminAuthProvider');
  }
  return context;
};
