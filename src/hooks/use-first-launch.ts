import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const FIRST_LAUNCH_KEY = '@first_launch';

const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(FIRST_LAUNCH_KEY).then((value) => {
      setIsFirstLaunch(value === null);
    });
  }, []);

  const markLaunched = () => AsyncStorage.setItem(FIRST_LAUNCH_KEY, '1');

  return { isFirstLaunch, markLaunched };
};

export default useFirstLaunch;
