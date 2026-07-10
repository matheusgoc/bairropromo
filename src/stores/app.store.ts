import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
  isFirstLaunch: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setIsFirstLaunch: (v: boolean) => void;
  markLaunched: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isFirstLaunch: true,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      setIsFirstLaunch: (v) => set({ isFirstLaunch: v }),
      markLaunched: () => set({ isFirstLaunch: false }),
    }),
    {
      name: '@app',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
