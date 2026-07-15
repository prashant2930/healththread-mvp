import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../../types';
import { demoUser } from '../../data/demo/demoData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isDemo = import.meta.env.VITE_APP_MODE === 'demo' || true; // forcing demo for MVP sprint 1

  useEffect(() => {
    // If demo mode is active, auto-login with demo user for ease of testing
    if (isDemo) {
      setUser(demoUser);
    }
  }, [isDemo]);

  const login = async (email: string) => {
    if (isDemo) {
      setUser(demoUser);
    }
    // Implement Supabase auth here later
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isDemo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
