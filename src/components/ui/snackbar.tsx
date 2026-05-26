import React, { ComponentProps, FC } from 'react';
import { Portal, Snackbar as RNPSnackbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useAppTheme from '@/hooks/use-app-theme';

export type SnackbarMode = 'default' | 'success' | 'warning' | 'danger';

type ModeColors = {
  container: string;
  onContainer: string;
};

const useModeColors = (mode: SnackbarMode): ModeColors => {
  const { colors } = useAppTheme();

  const map: Record<SnackbarMode, ModeColors> = {
    default: {
      container: colors.primary,
      onContainer: colors.onPrimary,
    },
    success: {
      container: colors.success,
      onContainer: colors.onSuccess,
    },
    warning: {
      container: colors.warningContainer,
      onContainer: colors.onWarningContainer,
    },
    danger: {
      container: colors.error,
      onContainer: colors.onError,
    },
  };

  return map[mode];
};

interface Props extends Omit<
  ComponentProps<typeof RNPSnackbar>,
  'children' | 'visible'
> {
  message: string;
  mode?: SnackbarMode;
}

const Snackbar: FC<Props> = ({ message, mode = 'default', ...props }) => {
  const insets = useSafeAreaInsets();
  const colors = useModeColors(mode);

  return (
    <Portal>
      <RNPSnackbar
        wrapperStyle={{ top: insets.top, bottom: undefined }}
        style={{ backgroundColor: colors.container }}
        onIconPress={props.onDismiss}
        {...props}
        visible={!!message}
      >
        <Text style={{ color: colors.onContainer }}>{message}</Text>
      </RNPSnackbar>
    </Portal>
  );
};

export default Snackbar;
