/** Auth store with Zustand */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import { authService } from '@/services/auth';
import { storage } from '@/services/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (phone: string, code: string) => Promise<void>;
  register: (phone: string, nickname: string, code: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (phone: string, code: string) => {
        set({ isLoading: true });
        try {
          const res = await authService.login({ phone, code });
          const { access_token, user } = res.data;

          await storage.setToken(access_token);
          await storage.setUser(user);

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (phone: string, nickname: string, code: string) => {
        set({ isLoading: true });
        try {
          const res = await authService.register({ phone, nickname, code });
          const { access_token, user } = res.data;

          await storage.setToken(access_token);
          await storage.setUser(user);

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        storage.clear();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        storage.setUser(user);
        set({ user });
      },

      setToken: (token: string) => {
        storage.setToken(token);
        set({ token, isAuthenticated: !!token });
      },

      checkAuth: async () => {
        const token = await storage.getToken();
        const user = await storage.getUser();

        if (token && user) {
          set({
            user,
            token,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
