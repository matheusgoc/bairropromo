import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { FC, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import ProfileService from '@/services/profile.service';
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

const AppBootstrap: FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn } = useAuth();
  const { setStatus, reset } = useSubscription();

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: ProfileService.get,
    enabled: isSignedIn,
  });

  useEffect(() => {
    if (data?.subscriptionStatus) setStatus(data.subscriptionStatus);
  }, [data?.subscriptionStatus, setStatus]);

  useEffect(() => {
    if (!isSignedIn) reset();
  }, [isSignedIn, reset]);

  return <>{children}</>;
};

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
            <AppBootstrap>
              <KeyboardProvider>
                <Router />
              </KeyboardProvider>
            </AppBootstrap>
          </QueryClientProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
