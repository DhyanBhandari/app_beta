import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/models/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  chatCount: number;
  incrementChatCount: () => void;
  resetChatCount: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setUserRole: (role: 'user' | 'organization') => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const incrementChatCount = () => {
    setChatCount(prev => prev + 1);
  };

  const resetChatCount = () => {
    setChatCount(0);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      email,
      name: 'Demo User',
      role: 'user',
      createdAt: new Date(),
      onboardingCompleted: false,
    };
    
    setUser(mockUser);
    resetChatCount(); // Reset chat count on login
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: '1',
      email,
      name,
      role: 'user',
      createdAt: new Date(),
      onboardingCompleted: false,
    };
    
    setUser(mockUser);
    resetChatCount(); // Reset chat count on register
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setChatCount(0); // Reset chat count on logout
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const setUserRole = (role: 'user' | 'organization') => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const completeOnboarding = () => {
    if (user) {
      setUser({ ...user, onboardingCompleted: true });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      chatCount,
      incrementChatCount,
      resetChatCount,
      login,
      register,
      logout,
      updateUser,
      setUserRole,
      completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}