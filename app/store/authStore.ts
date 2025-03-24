'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode?: string;
  referredBy?: string;
  points: number;
  joinedDate: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    referredBy?: string;
  }) => Promise<void>;
  signOut: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        // This would typically make an API call
        // For now, we'll simulate a successful login
        const mockUser: User = {
          id: '1',
          name: 'Test User',
          email,
          points: 0,
          joinedDate: new Date().toISOString(),
          referralCode: 'TEST123',
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      signUp: async (userData) => {
        // This would typically make an API call
        const mockUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          points: 0,
          joinedDate: new Date().toISOString(),
          referralCode: 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          referredBy: userData.referredBy,
        };
        set({ user: mockUser, isAuthenticated: true });
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 