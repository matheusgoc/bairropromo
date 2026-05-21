import { useTheme } from 'react-native-paper';

import { DefaultTheme } from '@/types';

const useAppTheme = () => useTheme<DefaultTheme>();

export default useAppTheme;
