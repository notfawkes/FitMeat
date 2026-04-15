import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import * as authClient from '../services/authClient';

interface ProfileData {
  id: string;
  email: string;
  name: string;
  address: string;
  phone_number: string;
}

interface OrderData {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  items: unknown;
  status: string;
}

interface AuthContextValue {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email: string } | null;
  profile: ProfileData | null;
  orders: OrderData[];
  loading: boolean;
  signup: (payload: authClient.SignupPayload) => Promise<void>;
  login: (payload: authClient.LoginPayload) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  reloadProfile: (overrideToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'fitmeat_access_token';
const REFRESH_TOKEN_KEY = 'fitmeat_refresh_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY));
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setProfile(null);
    setOrders([]);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  const reloadProfile = useCallback(async (overrideToken?: string) => {
    const token = overrideToken || accessToken;
    if (!token) {
      clearSession();
      return;
    }

    try {
      const result = await authClient.getMe(token);
      setUser(result.user);
      setProfile(result.profile ?? null);
      setOrders(result.orders ?? []);
    } catch (error) {
      console.error('Failed to reload profile:', error);
      clearSession();
    }
  }, [accessToken, clearSession]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      clearSession();
      return;
    }

    try {
      const result = await authClient.refresh(refreshToken);
      setAccessToken(result.accessToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
    } catch (error) {
      console.error('Refresh failed:', error);
      clearSession();
      throw error;
    }
  }, [refreshToken, clearSession]);

  const login = useCallback(async (payload: authClient.LoginPayload) => {
    setLoading(true);
    try {
      const result = await authClient.login(payload);
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      await reloadProfile(result.accessToken);
    } finally {
      setLoading(false);
    }
  }, [reloadProfile]);

  const signup = useCallback(async (payload: authClient.SignupPayload) => {
    setLoading(true);
    try {
      await authClient.signup(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const initialize = async () => {
      if (accessToken) {
        await reloadProfile();
      }
      setLoading(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      profile,
      orders,
      loading,
      signup,
      login,
      logout,
      refreshAccessToken,
      reloadProfile,
    }),
    [accessToken, refreshToken, user, profile, orders, loading, signup, login, logout, refreshAccessToken, reloadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line no-restricted-syntax
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
