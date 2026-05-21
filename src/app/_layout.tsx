import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DARK_THEME, LIGHT_THEME } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // paper theme
  const paperTheme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  // nav theme adaptation
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });
  const navTheme =
    colorScheme === 'dark'
      ? { ...DarkTheme, colors: { ...DarkTheme.colors, ...paperTheme.colors } }
      : {
          ...LightTheme,
          colors: { ...LightTheme.colors, ...paperTheme.colors },
        };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <PaperProvider theme={paperTheme}>
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <Slot />
            </KeyboardProvider>
          </QueryClientProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
