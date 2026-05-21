import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const LIGHT_THEME = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    success: 'rgb(16, 109, 32)',
    onSuccess: 'rgb(255, 255, 255)',
    successContainer: 'rgb(157, 248, 152)',
    onSuccessContainer: 'rgb(0, 34, 4)',
    warning: 'rgb(121, 89, 0)',
    onWarning: 'rgb(255, 255, 255)',
    warningContainer: 'rgb(255, 223, 160)',
    onWarningContainer: 'rgb(38, 26, 0)',
  },
};

export const DARK_THEME = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    success: 'rgb(130, 219, 126)',
    onSuccess: 'rgb(0, 57, 10)',
    successContainer: 'rgb(0, 83, 18)',
    onSuccessContainer: 'rgb(157, 248, 152)',
    warning: 'rgb(248, 189, 42)',
    onWarning: 'rgb(64, 45, 0)',
    warningContainer: 'rgb(92, 67, 0)',
    onWarningContainer: 'rgb(255, 223, 160)',
  },
};
