import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { FC } from 'react';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DARK_THEME, LIGHT_THEME } from '@/theme';

if (__DEV__) {
  void import('../ReactotronConfig');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});

const Router: FC = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen
      name="onboard/onboard-welcome"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-call"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-gate"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-signin"
      options={{
        title: 'Entrar',
        presentation: 'formSheet',
        sheetGrabberVisible: true,
        sheetAllowedDetents: [0.7],
      }}
    />
    <Stack.Screen
      name="onboard/onboard-reset"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-signup"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-password"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-apply"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="onboard/onboard-success"
      options={{ headerShown: false }}
    />
  </Stack>
);

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
              <Router />
            </KeyboardProvider>
          </QueryClientProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
