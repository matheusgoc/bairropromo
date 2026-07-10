import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { StoreApi } from 'zustand';

import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';

function trackStore<T>(name: string, store: StoreApi<T>) {
  Reactotron.display({
    name: `ZUSTAND / ${name}`,
    value: store.getState() as Record<string, unknown>,
    preview: 'initial state',
  });
  store.subscribe((state) => {
    Reactotron.display({
      name: `ZUSTAND / ${name}`,
      value: state as Record<string, unknown>,
      preview: 'state update',
    });
  });
}

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({ name: 'BP' })
  .useReactNative({ asyncStorage: true, networking: true, editor: true })
  .connect();

// Add one line per store here
trackStore('auth', useAuthStore);
trackStore('app', useAppStore);

Reactotron.onCustomCommand({
  command: 'Reset First Launch',
  description:
    'Set isFirstLaunch=true so the onboard welcome shows on next reload',
  handler: () => useAppStore.getState().setIsFirstLaunch(true),
});

Reactotron.onCustomCommand({
  command: 'Sign Out',
  description: 'Clear the auth token',
  handler: () => useAuthStore.getState().signOut(),
});
