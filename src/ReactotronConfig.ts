import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
import { StoreApi } from 'zustand';

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
