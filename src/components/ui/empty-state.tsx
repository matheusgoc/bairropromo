import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

import { DefaultTheme } from '@/types';

interface Props {
  title?: string;
  subtitle?: string;
}

const EmptyState = ({ title, subtitle }: Props) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return useMemo(
    () => (
      <View style={styles.container}>
        <Icon source="alert" size={50} color={theme.colors.primary} />
        <Text variant="headlineSmall" style={styles.title}>
          {title ?? 'Sem dados!'}
        </Text>
        {subtitle && (
          <Text variant="titleMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
    ),
    [styles, theme.colors.primary, title, subtitle],
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
  });

export default EmptyState;
