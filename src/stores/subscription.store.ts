import { create } from 'zustand';

import ProfileModel from '@/models/profile.model';

export type SubscriptionStatus = ProfileModel['subscriptionStatus'] | null;

interface SubscriptionState {
  status: SubscriptionStatus;
  setStatus: (status: SubscriptionStatus) => void;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  status: null,
  setStatus: (status) => set({ status }),
  reset: () => set({ status: null }),
}));
