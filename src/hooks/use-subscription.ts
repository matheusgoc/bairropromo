import { useSubscriptionStore } from '@/stores/subscription.store';

export function useSubscription() {
  const status = useSubscriptionStore((s) => s.status);
  const setStatus = useSubscriptionStore((s) => s.setStatus);
  const reset = useSubscriptionStore((s) => s.reset);
  return { status, isSubscribed: status === 'success', setStatus, reset };
}
