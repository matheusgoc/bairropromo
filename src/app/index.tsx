import { Redirect } from 'expo-router';

import useFirstLaunch from '@/hooks/use-first-launch';

export default function Index() {
  const { isFirstLaunch } = useFirstLaunch();

  if (isFirstLaunch) return <Redirect href="/onboard/onboard-welcome" />;
  return <Redirect href="/(tabs)/place/place-list" />;
}
