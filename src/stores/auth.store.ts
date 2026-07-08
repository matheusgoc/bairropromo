import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  signIn: (token: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      signIn: (token) => set({ token }),
      signOut: () => set({ token: null }),
    }),
    {
      name: '@auth',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

export const getAuthToken = () => useAuthStore.getState().token;
