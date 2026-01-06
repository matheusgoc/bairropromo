import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  // paper theme using material3 colors
  const paperTheme =
    colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  // nav theme adaptation based on material3 colors
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
          <Slot />
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
