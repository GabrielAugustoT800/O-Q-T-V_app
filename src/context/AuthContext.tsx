import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { SessionUser } from '@/types/User';
import { login as loginApi, getSession as getSessionApi, logout as logoutApi, saveSession } from '@/services/authService';

interface AuthContextValue {
  user: SessionUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getSessionApi();
      setUser(session);
      setIsLoading(false);
    })();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const session = await loginApi(email, password);
    await saveSession(session);
    setUser(session);
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  const value: AuthContextValue = { user, isLoading, signIn: handleLogin, signOut: handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};