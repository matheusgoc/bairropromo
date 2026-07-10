import { useAppStore } from '@/stores/app.store';

const useFirstLaunch = () => {
  const isFirstLaunch = useAppStore((s) => s.isFirstLaunch);
  const isHydrating = useAppStore((s) => !s._hasHydrated);
  const markLaunched = useAppStore((s) => s.markLaunched);

  return { isFirstLaunch, isHydrating, markLaunched };
};

export default useFirstLaunch;
