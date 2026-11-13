import { ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import useAppTheme from '@/hooks/use-app-theme';
import { DefaultTheme } from '@/types';

interface Props {
  title?: string;
  subtitle?: string;
  icon?: string;
  /** Rendered below the text, e.g. an action button. */
  children?: ReactNode;
}

const EmptyState = ({ title, subtitle, icon = 'alert', children }: Props) => {
  const theme = useAppTheme();
  const styles = useStyles(theme);

  return useMemo(
    () => (
      <View style={styles.container}>
        <Icon source={icon} size={50} color={theme.colors.primary} />
        <Text variant="headlineSmall" style={styles.title}>
          {title ?? 'Sem dados!'}
        </Text>
        {subtitle && (
          <Text variant="titleMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
        {children && <View style={styles.actions}>{children}</View>}
      </View>
    ),
    [styles, theme.colors.primary, icon, title, subtitle, children],
  );
};

const useStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      maxWidth: 300,
    },
    title: {
      marginTop: 10,
      color: theme.colors.primary,
      textAlign: 'center',
    },
    subtitle: {
      marginTop: 10,
      color: theme.colors.primary,
      textAlign: 'center',
    },
    actions: {
      marginTop: 20,
    },
  });

export default EmptyState;
