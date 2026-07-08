import { useAuthStore } from '@/stores/auth.store';

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s._hasHydrated);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);
  return {
    isSignedIn: !!token,
    isHydrating: !hydrated,
    token,
    signIn,
    signOut,
  };
}
