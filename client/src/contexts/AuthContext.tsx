import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Worker, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  worker: Worker | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, otp?: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginDemoPersona: (role: 'CUSTOMER' | 'WORKER' | 'SOCIETY_ADMIN') => Promise<void>;
  logout: () => void;
  updateWorkerState: (updated: Partial<Worker>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sahakar_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('sahakar_token');
      const storedRole = localStorage.getItem('sahakar_demo_role') as Role;

      if (storedToken || storedRole) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            setWorker(res.worker || null);
          } else {
            // Default demo persona fallback: Customer
            loginDemoPersona('CUSTOMER');
          }
        } catch {
          // If server just booted, default to Customer demo
          loginDemoPersona('CUSTOMER');
        }
      } else {
        // Default to Customer demo on initial first visit for smooth hackathon evaluation
        loginDemoPersona('CUSTOMER');
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (phone: string, otp?: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(phone, otp, password);
      if (res.success && res.user) {
        setUser(res.user);
        setWorker(res.worker || null);
        setToken(res.token);
        localStorage.setItem('sahakar_token', res.token);
        localStorage.setItem('sahakar_demo_role', res.user.role);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoPersona = async (role: 'CUSTOMER' | 'WORKER' | 'SOCIETY_ADMIN') => {
    setIsLoading(true);
    let phone = '9999999999';
    if (role === 'WORKER') phone = '8888888888';
    if (role === 'SOCIETY_ADMIN') phone = '7777777777';

    try {
      const res = await api.login(phone, '123456');
      if (res.success && res.user) {
        setUser(res.user);
        setWorker(res.worker || null);
        setToken(res.token);
        localStorage.setItem('sahakar_token', res.token);
        localStorage.setItem('sahakar_demo_role', res.user.role);
      }
    } catch (err) {
      console.error('Demo login error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setWorker(null);
    setToken(null);
    localStorage.removeItem('sahakar_token');
    localStorage.removeItem('sahakar_demo_role');
  };

  const updateWorkerState = (updated: Partial<Worker>) => {
    if (worker) {
      setWorker({ ...worker, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        worker,
        token,
        isLoading,
        login,
        loginDemoPersona,
        logout,
        updateWorkerState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
